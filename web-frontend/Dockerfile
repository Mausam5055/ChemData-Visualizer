# Use an official Node runtime as a parent image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port 5173 (Vite default)
EXPOSE 5173

# Run the application with --host to expose it
CMD ["npm", "run", "dev", "--", "--host"]
