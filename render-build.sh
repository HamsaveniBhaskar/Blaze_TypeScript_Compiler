#!/bin/bash

# Install dependencies
echo "Installing dependencies..."

# Install ts-node globally for faster execution
npm install -g ts-node typescript

# Install Node.js dependencies
npm install

echo "Dependencies installed successfully."

# Run the server
echo "Starting the server..."
npm start
