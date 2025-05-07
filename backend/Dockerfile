FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Donner les droits d'exécution
RUN chmod +x /app/entrypoint.sh || true

# Utiliser entrypoint + cmd
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python", "app.py"]
