# Use an official node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# 🔄 Copy the entire app now (this brings in your prisma folder too)
COPY . .

# ✅ Now Prisma schema is available
RUN npx prisma generate

# Expose the app port
EXPOSE 5000

# Run the app
CMD ["node", "./src/server.js"]
