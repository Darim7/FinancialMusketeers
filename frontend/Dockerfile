# syntax=docker/dockerfile:1.4

# Create image based on the official Node image from dockerhub
FROM node:lts-buster AS development

WORKDIR /app

# Copy dependency definitions
COPY package.json /app
COPY package-lock.json /app

# Install dependecies
#RUN npm set progress=false \
#    && npm config set depth 0 \
#    && npm i install
RUN npm ci

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]
