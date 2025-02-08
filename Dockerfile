# Use a lightweight Node.js image
FROM node:16-alpine

# Install ts-node globally for faster execution
RUN npm install -g ts-node typescript

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of the app
COPY . .

# Expose port and run server
EXPOSE 3000
CMD ["node", "server.js"]
