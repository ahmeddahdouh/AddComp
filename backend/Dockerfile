FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Installer netcat pour la commande nc dans le script
RUN apt-get update && apt-get install -y netcat-openbsd

# Créer le script directement dans le Dockerfile
RUN echo '#!/bin/sh' > /app/entrypoint.sh \
    && echo 'echo "Waiting for db..."' >> /app/entrypoint.sh \
    && echo 'while ! nc -z db 5432; do' >> /app/entrypoint.sh \
    && echo '  sleep 0.5' >> /app/entrypoint.sh \
    && echo 'done' >> /app/entrypoint.sh \
    && echo 'echo "PostgreSQL started"' >> /app/entrypoint.sh \
    && echo 'exec "$@"' >> /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

COPY . .

ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
CMD ["python", "app.py"]