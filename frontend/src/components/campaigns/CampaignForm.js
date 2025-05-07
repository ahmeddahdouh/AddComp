import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getCampaign, createCampaign, updateCampaign } from '../../services/api';

const CampaignForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    budget: '',
    status: 'Draft'
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchCampaign();
    }
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await getCampaign(id);
      const campaign = response.data;
      
      setFormData({
        name: campaign.name,
        description: campaign.description || '',
        start_date: new Date(campaign.start_date),
        end_date: new Date(campaign.end_date),
        budget: campaign.budget.toString(),
        status: campaign.status
      });
    } catch (err) {
      setError('Failed to fetch campaign data. Please try again later.');
      console.error('Error fetching campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
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
      const payload = {
        ...formData,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
        budget: parseFloat(formData.budget)
      };

      if (isEditMode) {
        await updateCampaign(id, payload);
      } else {
        await createCampaign(payload);
      }
      
      navigate('/');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} campaign. Please check your inputs and try again.`);
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} campaign:`, err);
    }
  };

  if (loading) return <div>Loading campaign data...</div>;

  return (
    <div>
      <h1 className="page-title">{isEditMode ? 'Edit Campaign' : 'Create New Campaign'}</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-container">
            <Form.Group className="mb-3">
              <Form.Label>Campaign Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter campaign name"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a campaign name.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter campaign description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <DatePicker
                selected={formData.start_date}
                onChange={(date) => handleDateChange(date, 'start_date')}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please select a start date.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <DatePicker
                selected={formData.end_date}
                onChange={(date) => handleDateChange(date, 'end_date')}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                required
                minDate={formData.start_date}
              />
              <Form.Control.Feedback type="invalid">
                Please select an end date.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Budget ($)</Form.Label>
              <Form.Control
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter campaign budget"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid budget amount.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" as={Link} to={isEditMode ? `/campaigns/${id}` : '/'}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Update Campaign' : 'Create Campaign'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CampaignForm;