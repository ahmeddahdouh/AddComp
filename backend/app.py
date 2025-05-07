import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, Campaign, Advertisement
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

# Helper function to parse date strings
def parse_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except ValueError:
        return None

# Routes for Campaigns
@app.route('/api/campaigns', methods=['GET'])
def get_campaigns():
    campaigns = Campaign.query.all()
    return jsonify([campaign.to_dict() for campaign in campaigns])

@app.route('/api/campaigns/<int:campaign_id>', methods=['GET'])
def get_campaign(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    return jsonify(campaign.to_dict())

@app.route('/api/campaigns', methods=['POST'])
def create_campaign():
    data = request.json

    # Validate required fields
    required_fields = ['name', 'start_date', 'end_date', 'budget']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    # Parse dates
    start_date = parse_date(data['start_date'])
    end_date = parse_date(data['end_date'])

    if not start_date or not end_date:
        return jsonify({'error': 'Invalid date format'}), 400

    if start_date > end_date:
        return jsonify({'error': 'Start date must be before end date'}), 400

    # Create new campaign
    campaign = Campaign(
        name=data['name'],
        description=data.get('description', ''),
        start_date=start_date,
        end_date=end_date,
        budget=float(data['budget']),
        status=data.get('status', 'Draft')
    )

    db.session.add(campaign)
    db.session.commit()

    return jsonify(campaign.to_dict()), 201

@app.route('/api/campaigns/<int:campaign_id>', methods=['PUT'])
def update_campaign(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    data = request.json

    # Update fields if provided
    if 'name' in data:
        campaign.name = data['name']
    if 'description' in data:
        campaign.description = data['description']
    if 'start_date' in data:
        start_date = parse_date(data['start_date'])
        if not start_date:
            return jsonify({'error': 'Invalid start date format'}), 400
        campaign.start_date = start_date
    if 'end_date' in data:
        end_date = parse_date(data['end_date'])
        if not end_date:
            return jsonify({'error': 'Invalid end date format'}), 400
        campaign.end_date = end_date
    if 'budget' in data:
        campaign.budget = float(data['budget'])
    if 'status' in data:
        campaign.status = data['status']

    # Validate dates
    if campaign.start_date > campaign.end_date:
        return jsonify({'error': 'Start date must be before end date'}), 400

    db.session.commit()

    return jsonify(campaign.to_dict())

@app.route('/api/campaigns/<int:campaign_id>', methods=['DELETE'])
def delete_campaign(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    db.session.delete(campaign)
    db.session.commit()

    return jsonify({'message': 'Campaign deleted successfully'})

# Routes for Advertisements
@app.route('/api/campaigns/<int:campaign_id>/advertisements', methods=['GET'])
def get_advertisements(campaign_id):
    # Verify campaign exists
    Campaign.query.get_or_404(campaign_id)

    advertisements = Advertisement.query.filter_by(campaign_id=campaign_id).all()
    return jsonify([ad.to_dict() for ad in advertisements])

@app.route('/api/advertisements/<int:ad_id>', methods=['GET'])
def get_advertisement(ad_id):
    ad = Advertisement.query.get_or_404(ad_id)
    return jsonify(ad.to_dict())

@app.route('/api/campaigns/<int:campaign_id>/advertisements', methods=['POST'])
def create_advertisement(campaign_id):
    # Verify campaign exists
    Campaign.query.get_or_404(campaign_id)

    data = request.json

    # Validate required fields
    if 'title' not in data:
        return jsonify({'error': 'Missing required field: title'}), 400

    # Create new advertisement
    ad = Advertisement(
        campaign_id=campaign_id,
        title=data['title'],
        content=data.get('content', ''),
        image_url=data.get('image_url', ''),
        target_audience=data.get('target_audience', '')
    )

    db.session.add(ad)
    db.session.commit()

    return jsonify(ad.to_dict()), 201

@app.route('/api/advertisements/<int:ad_id>', methods=['PUT'])
def update_advertisement(ad_id):
    ad = Advertisement.query.get_or_404(ad_id)
    data = request.json

    # Update fields if provided
    if 'title' in data:
        ad.title = data['title']
    if 'content' in data:
        ad.content = data['content']
    if 'image_url' in data:
        ad.image_url = data['image_url']
    if 'target_audience' in data:
        ad.target_audience = data['target_audience']

    db.session.commit()

    return jsonify(ad.to_dict())

@app.route('/api/advertisements/<int:ad_id>', methods=['DELETE'])
def delete_advertisement(ad_id):
    ad = Advertisement.query.get_or_404(ad_id)
    db.session.delete(ad)
    db.session.commit()

    return jsonify({'message': 'Advertisement deleted successfully'})

# Create database tables
def create_tables():
    db.create_all()

if __name__ == '__main__':
    # Create tables before running the app
    with app.app_context():
        create_tables()
    app.run(debug=True, host='0.0.0.0', port=5000)
