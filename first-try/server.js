try {
  require('dotenv').config();
} catch {
  // dotenv not installed; ignore in tests
}
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// IMPORTANT: Raw body capture for Slack signature verification
app.use('/slack', express.raw({ type: 'application/x-www-form-urlencoded' }));

// Slack signature verification
function verifySlackSignature(req, res, next) {
  const slackSignature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  
  if (!slackSignature || !timestamp) {
    return res.status(401).send('Unauthorized');
  }
  
  // Check timestamp to prevent replay attacks
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - timestamp) > 300) {
    return res.status(401).send('Request timeout');
  }
  
  // Get raw body
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '';
  
  // Create signature
  const sigBasestring = `v0:${timestamp}:${rawBody}`;
  const mySignature = 'v0=' + crypto
    .createHmac('sha256', signingSecret)
    .update(sigBasestring)
    .digest('hex');
  
  // Compare signatures
  if (
    mySignature.length === slackSignature.length &&
    crypto.timingSafeEqual(
      Buffer.from(mySignature, 'utf8'),
      Buffer.from(slackSignature, 'utf8')
    )
  ) {
    try {
      req.body = JSON.parse(rawBody);
    } catch (err) {
      req.body = Object.fromEntries(new URLSearchParams(rawBody));
    }
    next();
  } else {
    console.log('Signature verification failed');
    return res.status(401).send('Unauthorized');
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Track active SessionBoard prompt threads
const sessionboardThreads = new Set();

// Slack API wrapper
class SlackAPI {
  constructor(token) {
    this.token = token;
    this.baseURL = 'https://slack.com/api';
  }
  
  async request(method, data = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/${method}`, data, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Slack API error (${method}):`, error.response?.data || error.message);
      throw error;
    }
  }
  
  async postMessage(channel, text, blocks = null, thread_ts = null) {
    const payload = { channel, text };
    if (blocks) payload.blocks = blocks;
    if (thread_ts) payload.thread_ts = thread_ts;
    return this.request('chat.postMessage', payload);
  }
  
  async postEphemeral(channel, user, text) {
    return this.request('chat.postEphemeral', { channel, user, text });
  }
}

const slack = new SlackAPI(process.env.SLACK_BOT_TOKEN);

// SessionBoard knowledge base scraper
class SessionBoardSearch {
  constructor() {
    this.baseUrl = 'https://learn.sessionboard.com/en/knowledge-base';
    this.cache = new Map();
  }

  async searchKnowledgeBase(query) {
    try {
      // First, get the main knowledge base page to find article links
      const response = await axios.get(this.baseUrl);
      const $ = cheerio.load(response.data);
      
      const articles = [];
      
      // Extract article links and titles
      $('a[href*="/knowledge-base/"]').each((i, element) => {
        const title = $(element).text().trim();
        const href = $(element).attr('href');
        if (title && href && title.length > 3) {
          articles.push({
            title: title,
            url: href.startsWith('http') ? href : `https://learn.sessionboard.com${href}`
          });
        }
      });

      // Search through articles for relevant content
      const searchResults = await this.searchArticles(articles, query);
      return searchResults;
      
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async searchArticles(articles, query) {
    const queryLower = query.toLowerCase();
    const results = [];
    
    for (const article of articles.slice(0, 10)) { // Limit to prevent rate limiting
      try {
        if (this.cache.has(article.url)) {
          const content = this.cache.get(article.url);
          if (this.contentMatches(content, queryLower)) {
            results.push({
              ...article,
              snippet: this.extractSnippet(content, queryLower)
            });
          }
        } else {
          const response = await axios.get(article.url);
          const $ = cheerio.load(response.data);
          const content = $('body').text().toLowerCase();
          
          this.cache.set(article.url, content);
          
          if (this.contentMatches(content, queryLower)) {
            results.push({
              ...article,
              snippet: this.extractSnippet(content, queryLower)
            });
          }
        }
        
        // Add delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error fetching ${article.url}:`, error.message);
      }
    }
    
    return results.slice(0, 5); // Return top 5 results
  }

  contentMatches(content, query) {
    return content.includes(query) || 
           query.split(' ').some(word => content.includes(word));
  }

  extractSnippet(content, query) {
    const index = content.indexOf(query);
    if (index === -1) return '';
    
    const start = Math.max(0, index - 100);
    const end = Math.min(content.length, index + 200);
    return content.substring(start, end).trim() + '...';
  }
}

const searcher = new SessionBoardSearch();

// Slash command handler
app.post('/slack/commands', verifySlackSignature, async (req, res) => {
  try {
    const { command, user_id, channel_id, thread_ts } = req.body;
    if (command === '/sessionboard') {
      // Post the prompt as a public message, in the thread if triggered from one
      const prompt = await slack.postMessage(
        channel_id,
        `<@${user_id}> What question do you have? Please reply in this thread.`,
        null,
        thread_ts || null
      );
      // Record the thread_ts of the prompt message
      if (prompt && prompt.ts) {
        sessionboardThreads.add(prompt.ts);
      }
      // Respond to Slack immediately with 200 OK and no message (no ephemeral)
      res.status(200).end();
    } else {
      res.json({
        response_type: 'ephemeral',
        text: 'Unknown command'
      });
    }
  } catch (error) {
    console.error('Command handler error:', error);
    res.status(500).json({
      response_type: 'ephemeral',
      text: 'Internal server error'
    });
  }
});

// Event handler
app.post(
  '/slack/events',
  express.raw({ type: 'application/json' }),
  verifySlackSignature,
  async (req, res) => {
    // Parse the raw body to JSON after signature verification
    if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
      try {
        req.body = JSON.parse(req.body.toString('utf8'));
      } catch (e) {
        req.body = {};
      }
    }
    if (req.body.type === 'url_verification') {
      return res.json({ challenge: req.body.challenge });
    }
    // Listen for message events in threads started by the bot
    if (req.body.event && req.body.event.type === 'message' && req.body.event.thread_ts && !req.body.event.subtype) {
      const { thread_ts, text, user, channel } = req.body.event;
      if (sessionboardThreads.has(thread_ts)) {
        // Search the knowledge base and reply in the thread
        try {
          const results = await searcher.searchKnowledgeBase(text || 'getting started');
          await sendSearchResults(channel, user, text, results, thread_ts);
        } catch (error) {
          console.error('Search error:', error);
          await slack.postEphemeral(channel, user, 'Sorry, I encountered an error while searching. Please try again.');
        }
      }
    }
    // For actual events, simply acknowledge
    res.status(200).send();
  }
);

async function sendSearchResults(channel, user, query, results, thread_ts) {
  if (results.length === 0) {
    await slack.postMessage(
      channel,
      `No results found for "${query}". Try searching for general topics like "getting started", "setup", or "features".`,
      undefined,
      thread_ts
    );
    return;
  }

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*SessionBoard Knowledge Base Results for "${query}"*`
      }
    },
    {
      type: 'divider'
    }
  ];

  results.forEach((result, index) => {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*<${result.url}|${result.title}>*\n${result.snippet || 'Click to read more...'}`
      }
    });
    if (index < results.length - 1) {
      blocks.push({ type: 'divider' });
    }
  });

  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: 'Use `/sessionboard` to start a new search.'
      }
    ]
  });

  await slack.postMessage(
    channel,
    `Found ${results.length} results for "${query}"`,
    blocks,
    thread_ts
  );
}

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SessionBoard Slack app listening on port ${PORT}`);
    console.log('Config:', {
      HAS_SECRET: !!process.env.SLACK_SIGNING_SECRET,
      HAS_TOKEN: !!process.env.SLACK_BOT_TOKEN
    });
  });
}

module.exports = app;