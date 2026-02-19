# Docker Deployment Instructions for SS-hangman-game

## Overview
This document provides comprehensive instructions for deploying the SS-hangman-game using Docker, including necessary commands and examples.

## Prerequisites
- Docker installed on your machine.
- Basic understanding of Docker concepts.

## Getting Started

### Step 1: Clone the Repository
If you haven't already, clone the repository:
```bash
git clone https://github.com/Jordon-py/SS-hangman-game.git
cd SS-hangman-game
```

### Step 2: Create a Dockerfile
Your project should include a `Dockerfile`. Below is a basic example:
```Dockerfile
# Use the official Python image.
FROM python:3.8-slim

# Set the working directory.
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make ports available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```

### Step 3: Build the Docker Image
To build the Docker image, run the following command from the root directory of your project:
```bash
docker build -t ss-hangman-game .
```

### Step 4: Run the Docker Container
To run your application in a container, use:
```bash
docker run -p 4000:5000 ss-hangman-game
```
This maps port 5000 in the container to port 4000 on your host, allowing you to access the app at `http://localhost:4000`.

### Useful Docker Commands
- List Docker images:
  ```bash
docker images
  ```
- List running containers:
  ```bash
docker ps
  ```
- Stop a running container:
  ```bash
docker stop <container_id>
  ```
- Remove a Docker image:
  ```bash
docker rmi <image_id>
  ```

## Conclusion
You have successfully set up Docker for the SS-hangman-game project. Ensure to keep your images up-to-date and manage your containers as needed!