#!/bin/bash

# Use Railway's PORT or default to 4200
PORT=${PORT:-4200}

echo "Starting server on port $PORT"

# Set Node.js memory limits for runtime
export NODE_OPTIONS="--max-old-space-size=512"

# Start Express server
node server.js 