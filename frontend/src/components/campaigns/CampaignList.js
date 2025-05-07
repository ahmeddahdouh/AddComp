import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { getCampaigns, deleteCampaign } from '../../services/api';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await getCampaigns();
      setCampaigns(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch campaigns. Please try again later.');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(id);
        setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      } catch (err) {
        setError('Failed to delete campaign. Please try again later.');
        console.error('Error deleting campaign:', err);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'completed': return 'status-completed';
      default: return 'status-draft';
    }
  };

  if (loading) return <div>Loading campaigns...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">Advertising Campaigns</h1>
        <Button variant="primary" as={Link} to="/campaigns/new">
          Create New Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="alert alert-info">
          No campaigns found. Click "Create New Campaign" to get started.
        </div>
      ) : (
        <Row>
          {campaigns.map(campaign => (
            <Col md={6} lg={4} key={campaign.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{campaign.name}</Card.Title>
                  <Card.Text>{campaign.description}</Card.Text>
                  <div className="mb-2">
                    <span className={`campaign-status ${getStatusBadgeClass(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>Budget:</strong> ${campaign.budget.toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <strong>Period:</strong> {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                  </div>
                </Card.Body>
                <Card.Footer>
                  <div className="action-buttons">
                    <Button variant="outline-primary" size="sm" as={Link} to={`/campaigns/${campaign.id}`}>
                      View
                    </Button>
                    <Button variant="outline-secondary" size="sm" as={Link} to={`/campaigns/${campaign.id}/edit`}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(campaign.id)}>
                      Delete
                    </Button>
                    <Button variant="outline-info" size="sm" as={Link} to={`/campaigns/${campaign.id}/advertisements`}>
                      Ads
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CampaignList;