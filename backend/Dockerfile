# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.8-slim-buster

EXPOSE 8000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /spacscanner/backend
ADD . /spacscanner/backend

# Install dependencies
COPY Pipfile Pipfile.lock /spacscanner/backend/
RUN pip install pipenv && pipenv install --system

# Copy project
COPY . /spacscanner/backend/