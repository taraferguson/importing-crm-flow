import { test } from 'node:test';
import assert from 'node:assert';
import crypto from 'node:crypto';
import app from '../server.js';

function startServer() {
  return new Promise(resolve => {
    const server = app.listen(0, () => {
      resolve(server);
    });
  });
}

function sign(body, timestamp, secret) {
  return 'v0=' + crypto.createHmac('sha256', secret)
    .update(`v0:${timestamp}:${body}`)
    .digest('hex');
}

test('url verification succeeds with valid signature', async () => {
  process.env.SLACK_SIGNING_SECRET = 'testsecret';
  const server = await startServer();
  const { port } = server.address();
  const body = JSON.stringify({ type: 'url_verification', challenge: 'abc' });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sig = sign(body, timestamp, process.env.SLACK_SIGNING_SECRET);

  const res = await fetch(`http://localhost:${port}/slack/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Slack-Request-Timestamp': timestamp,
      'X-Slack-Signature': sig
    },
    body
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.deepStrictEqual(data, { challenge: 'abc' });
  await new Promise(r => server.close(r));
});

test('invalid signature is rejected', async () => {
  process.env.SLACK_SIGNING_SECRET = 'testsecret';
  const server = await startServer();
  const { port } = server.address();
  const body = JSON.stringify({ type: 'url_verification', challenge: 'abc' });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const sig = sign('wrong', timestamp, process.env.SLACK_SIGNING_SECRET);

  const res = await fetch(`http://localhost:${port}/slack/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Slack-Request-Timestamp': timestamp,
      'X-Slack-Signature': sig
    },
    body
  });

  assert.strictEqual(res.status, 401);
  await new Promise(r => server.close(r));
});
