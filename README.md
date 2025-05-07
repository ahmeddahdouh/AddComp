# Advertising Campaign Management Application

A full-stack web application for managing advertising campaigns and their advertisements, built with Flask (backend), React (frontend), and PostgreSQL (database).

## Project Structure

The project is organized into two main directories:

- **backend**: Contains the Flask API server
- **frontend**: Contains the React application

## Backend

The backend is a RESTful API built with Flask that provides endpoints for managing campaigns and advertisements.

### Technologies Used

- Flask: Web framework
- SQLAlchemy: ORM for database operations
- Flask-Migrate: Database migrations
- Flask-CORS: Cross-Origin Resource Sharing
- PostgreSQL: Database

### Models

- **Campaign**: Represents an advertising campaign with properties like name, description, dates, budget, and status
- **Advertisement**: Represents an advertisement within a campaign with properties like title, content, image URL, and target audience

### API Endpoints

#### Campaigns

- `GET /api/campaigns`: Get all campaigns
- `GET /api/campaigns/<id>`: Get a specific campaign
- `POST /api/campaigns`: Create a new campaign
- `PUT /api/campaigns/<id>`: Update a campaign
- `DELETE /api/campaigns/<id>`: Delete a campaign

#### Advertisements

- `GET /api/campaigns/<campaign_id>/advertisements`: Get all advertisements for a campaign
- `GET /api/advertisements/<id>`: Get a specific advertisement
- `POST /api/campaigns/<campaign_id>/advertisements`: Create a new advertisement
- `PUT /api/advertisements/<id>`: Update an advertisement
- `DELETE /api/advertisements/<id>`: Delete an advertisement

## Frontend

The frontend is a React application that provides a user interface for managing campaigns and advertisements.

### Technologies Used

- React: UI library
- React Router: Navigation
- React Bootstrap: UI components
- Axios: HTTP client
- React DatePicker: Date selection

### Components

- **Navigation**: Top navigation bar
- **CampaignList**: Displays all campaigns
- **CampaignDetail**: Shows details of a specific campaign
- **CampaignForm**: Form for creating/editing campaigns
- **AdvertisementList**: Displays all advertisements for a campaign
- **AdvertisementForm**: Form for creating/editing advertisements

## Setup and Running

### Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL

### Database Setup

1. Create a PostgreSQL database named `compagnePub`
2. The backend will use the credentials from the `.env` file

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```
   python app.py
   ```

The backend server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the React application:
   ```
   npm start
   ```

The frontend application will run on http://localhost:3000

## Usage

1. Create campaigns with details like name, description, dates, budget, and status
2. Add advertisements to campaigns with title, content, image URL, and target audience
3. View, edit, and delete campaigns and advertisements

## Environment Variables

The backend uses the following environment variables from the `.env` file:

```
DB_USER=postgres
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=5432
DB_NAME=compagnePub
```