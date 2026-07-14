FROM node:22-bookworm

# Install Ghostscript
RUN apt-get update && \
    apt-get install -y --no-install-recommends ghostscript && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Render provides the PORT environment variable
ENV PORT=10000

EXPOSE 10000

CMD ["npm", "start"]