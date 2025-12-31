FROM python:3.10-slim

# Install pipenv
RUN pip install pipenv

# Set working directory
WORKDIR /app

# Copy Pipfile and Pipfile.lock
COPY Pipfile Pipfile.lock ./

# Install dependencies
RUN pipenv install --deploy --system

# Copy application code
COPY static views config.yaml server.py ./

# Expose application port
EXPOSE 26752

# Run the application
CMD ["python", "server.py"]