# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Define vars
ARG CAT_API_KEY
ARG MJ_APIKEY_PUBLIC
ARG MJ_APIKEY_PRIVATE
ARG NEXT_PUBLIC_CAPTCHA_KEY
ARG CAPTCHA_SECRET

ENV CAT_API_KEY=$CAT_API_KEY
ENV MJ_APIKEY_PUBLIC=$MJ_APIKEY_PUBLIC
ENV MJ_APIKEY_PRIVATE=$MJ_APIKEY_PRIVATE
ENV NEXT_PUBLIC_CAPTCHA_KEY=$NEXT_PUBLIC_CAPTCHA_KEY
ENV CAPTCHA_SECRET=$CAPTCHA_SECRET

# Build your Next.js application
RUN npm run build

# Expose the port that your app will run on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
