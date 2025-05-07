import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { getCampaign, deleteCampaign } from '../../services/api';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await getCampaign(id);
      setCampaign(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch campaign details. Please try again later.');
      console.error('Error fetching campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete campaign. Please try again later.');
        console.error('Error deleting campaign:', err);
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'completed': return 'status-completed';
      default: return 'status-draft';
    }
  };

  if (loading) return <div>Loading campaign details...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!campaign) return <Alert variant="warning">Campaign not found</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">Campaign Details</h1>
        <div className="action-buttons">
          <Button variant="outline-secondary" as={Link} to="/">
            Back to List
          </Button>
          <Button variant="outline-primary" as={Link} to={`/campaigns/${id}/edit`}>
            Edit Campaign
          </Button>
          <Button variant="outline-danger" onClick={handleDelete}>
            Delete Campaign
          </Button>
          <Button variant="outline-info" as={Link} to={`/campaigns/${id}/advertisements`}>
            Manage Advertisements
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2>{campaign.name}</h2>
            <span className={`campaign-status ${getStatusClass(campaign.status)}`}>
              {campaign.status}
            </span>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h5>Description</h5>
              <p>{campaign.description || 'No description provided'}</p>
            </Col>
            <Col md={4}>
              <div className="mb-3">
                <h5>Budget</h5>
                <p>${campaign.budget.toFixed(2)}</p>
              </div>
              <div className="mb-3">
                <h5>Campaign Period</h5>
                <p>
                  <strong>Start:</strong> {new Date(campaign.start_date).toLocaleDateString()}<br />
                  <strong>End:</strong> {new Date(campaign.end_date).toLocaleDateString()}
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>
            Created: {new Date(campaign.created_at).toLocaleString()}<br />
            Last Updated: {new Date(campaign.updated_at).toLocaleString()}
          </small>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default CampaignDetail;