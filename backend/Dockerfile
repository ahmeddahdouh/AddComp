# Use an official Python runtime as a base image
FROM python:3.11

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Flask runs on
EXPOSE 5001

# Define the command to run the application
CMD ["python", "app.py"]