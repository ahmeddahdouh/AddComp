import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { getAdvertisements, deleteAdvertisement, getCampaign } from '../../services/api';

const AdvertisementList = () => {
  const { campaignId } = useParams();
  const [advertisements, setAdvertisements] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [campaignId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adsResponse, campaignResponse] = await Promise.all([
        getAdvertisements(campaignId),
        getCampaign(campaignId)
      ]);
      setAdvertisements(adsResponse.data);
      setCampaign(campaignResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch advertisements. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adId) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await deleteAdvertisement(adId);
        setAdvertisements(advertisements.filter(ad => ad.id !== adId));
      } catch (err) {
        setError('Failed to delete advertisement. Please try again later.');
        console.error('Error deleting advertisement:', err);
      }
    }
  };

  if (loading) return <div>Loading advertisements...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!campaign) return <Alert variant="warning">Campaign not found</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title">Advertisements</h1>
          <h5>Campaign: {campaign.name}</h5>
        </div>
        <div className="action-buttons">
          <Button variant="outline-secondary" as={Link} to={`/campaigns/${campaignId}`}>
            Back to Campaign
          </Button>
          <Button variant="primary" as={Link} to={`/campaigns/${campaignId}/advertisements/new`}>
            Create New Advertisement
          </Button>
        </div>
      </div>

      {advertisements.length === 0 ? (
        <Alert variant="info">
          No advertisements found for this campaign. Click "Create New Advertisement" to add one.
        </Alert>
      ) : (
        <Row>
          {advertisements.map(ad => (
            <Col md={4} key={ad.id}>
              <Card className="mb-4 advertisement-card">
                <Card.Body>
                  <Card.Title>{ad.title}</Card.Title>
                  {ad.image_url && (
                    <div className="mb-3 text-center">
                      <img 
                        src={ad.image_url} 
                        alt={ad.title} 
                        className="img-fluid" 
                        style={{ maxHeight: '150px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  )}
                  <Card.Text>{ad.content}</Card.Text>
                  {ad.target_audience && (
                    <div className="mb-2">
                      <strong>Target Audience:</strong> {ad.target_audience}
                    </div>
                  )}
                </Card.Body>
                <Card.Footer>
                  <div className="action-buttons">
                    <Button variant="outline-secondary" size="sm" as={Link} to={`/advertisements/${ad.id}/edit`}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(ad.id)}>
                      Delete
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

export default AdvertisementList;