#!/bin/bash

# Install dependencies
echo "Installing dependencies..."

# Install TypeScript globally
npm install -g typescript

# Install Node.js dependencies
npm install

echo "Dependencies installed successfully."

# Run the server
echo "Starting the server..."
npm start
