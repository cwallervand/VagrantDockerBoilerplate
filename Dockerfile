# Pull base image.
FROM node

# Add /app from host (path is relative to Dockerfile) to /myApplication in container
ADD /app /myApplication

# Install other things that you might need
RUN npm install -g gulp

# Set working directory to be /myApplication in container
WORKDIR /myApplication

# Install application dependencies
RUN npm install

CMD ["/bin/bash"]
