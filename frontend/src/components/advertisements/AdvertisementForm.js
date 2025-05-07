import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { 
  getAdvertisement, 
  createAdvertisement, 
  updateAdvertisement, 
  getCampaign 
} from '../../services/api';

const AdvertisementForm = () => {
  const { id, campaignId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    target_audience: ''
  });
  
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (isEditMode) {
          // Fetch advertisement data for edit mode
          const adResponse = await getAdvertisement(id);
          const ad = adResponse.data;
          
          setFormData({
            title: ad.title,
            content: ad.content || '',
            image_url: ad.image_url || '',
            target_audience: ad.target_audience || ''
          });
          
          // Also fetch campaign data to display campaign name
          const campaignResponse = await getCampaign(ad.campaign_id);
          setCampaign(campaignResponse.data);
        } else if (campaignId) {
          // For new advertisement, just fetch campaign data
          const campaignResponse = await getCampaign(campaignId);
          setCampaign(campaignResponse.data);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, campaignId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      if (isEditMode) {
        await updateAdvertisement(id, formData);
        navigate(`/campaigns/${campaign.id}/advertisements`);
      } else {
        await createAdvertisement(campaignId, formData);
        navigate(`/campaigns/${campaignId}/advertisements`);
      }
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} advertisement. Please check your inputs and try again.`);
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} advertisement:`, err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!campaign && !loading) return <Alert variant="danger">Campaign not found</Alert>;

  return (
    <div>
      <h1 className="page-title">
        {isEditMode ? 'Edit Advertisement' : 'Create New Advertisement'}
      </h1>
      <h5 className="mb-4">Campaign: {campaign?.name}</h5>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-container">
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter advertisement title"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a title.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={3}
                placeholder="Enter advertisement content"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Enter image URL (optional)"
              />
              <Form.Text className="text-muted">
                Provide a URL to an image for this advertisement.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Audience</Form.Label>
              <Form.Control
                type="text"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                placeholder="Enter target audience (optional)"
              />
            </Form.Group>

            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="secondary" 
                as={Link} 
                to={isEditMode 
                  ? `/campaigns/${campaign.id}/advertisements` 
                  : `/campaigns/${campaignId}/advertisements`}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Update Advertisement' : 'Create Advertisement'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdvertisementForm;