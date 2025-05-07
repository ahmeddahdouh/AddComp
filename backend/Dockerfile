# Utilise une image Python officielle
FROM python:3.10-slim

# Crée un répertoire pour l'application
WORKDIR /app

# Copie les fichiers nécessaires
COPY . /app

# Installe les dépendances système (si besoin pour psycopg2 par exemple)
RUN apt-get update && apt-get install -y gcc libpq-dev && \
    pip install --no-cache-dir --upgrade pip

# Installe les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Expose le port utilisé par Flask
EXPOSE 5000

# Commande pour lancer l'application
CMD ["python", "app.py"]
