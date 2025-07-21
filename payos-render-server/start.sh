#!/bin/bash

echo "🔍 Debugging Render.com Port Configuration"
echo "=========================================="
echo ""

echo "📊 Environment Variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "PWD: $PWD"
echo ""

echo "📦 Package.json start command:"
cat package.json | grep -A 1 '"start"'
echo ""

echo "🚀 Starting Node.js server..."
echo "Command: node server.js"
echo ""

# Start the server
node server.js
