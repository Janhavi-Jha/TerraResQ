FROM node:20-slim

WORKDIR /app

# Copy package definition
COPY package.json ./

# Install dependencies for Linux environment
RUN npm install

# Copy application
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
