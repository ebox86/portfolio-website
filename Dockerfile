# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Define vars
ARG NEXT_PUBLIC_CAT_API_KEY
ENV NEXT_PUBLIC_CAT_API_KEY=$NEXT_PUBLIC_CAT_API_KEY

# Build your Next.js application
RUN npm run build

# Expose the port that your app will run on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
