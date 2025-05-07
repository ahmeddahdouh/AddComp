
# Image de base
FROM python:3.10-slim

# Définir le répertoire de travail
WORKDIR /app

# Installation des dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir psycopg2-binary python-dotenv

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 5000

# Commande de démarrage
CMD ["python", "-c", "import time; import os; import psycopg2; \
    host = os.getenv('DB_HOST', 'db'); \
    while True: \
        try: \
            psycopg2.connect( \
                dbname=os.getenv('DB_NAME', 'addcomp'), \
                user=os.getenv('DB_USER', 'postgres'), \
                password=os.getenv('DB_PASSWORD'), \
                host=host, \
                port=os.getenv('DB_PORT', '5432') \
            ); \
            break; \
        except: \
            print('Waiting for database...'); \
            time.sleep(1); \
    print('Database ready!'); \
    import app; app.app.run(host='0.0.0.0', port=5000)"]