FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Installer netcat pour la commande nc dans le script
RUN apt-get update && apt-get install -y netcat-openbsd

# Copier le script d'entrée (au lieu de le créer dans le Dockerfile)
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Exposer le port 5000
EXPOSE 5000

COPY . .

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python", "app.py"]