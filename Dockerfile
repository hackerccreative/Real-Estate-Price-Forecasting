FROM node:18-slim

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create app directory
WORKDIR /app

# Copy ML files and install Python deps
COPY ml/ ./ml/
# Use --break-system-packages if using system python, or use venv. 
# For simplicity in this Dockerfile, we use break-system-packages for system-wide install in container.
RUN pip3 install -r ml/requirements.txt --break-system-packages

# Copy Backend files and install Node deps
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm install

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
