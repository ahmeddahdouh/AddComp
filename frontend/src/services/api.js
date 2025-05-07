import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Campaign API calls
export const getCampaigns = () => {
  return api.get('/campaigns');
};

export const getCampaign = (id) => {
  return api.get(`/campaigns/${id}`);
};

export const createCampaign = (campaignData) => {
  return api.post('/campaigns', campaignData);
};

export const updateCampaign = (id, campaignData) => {
  return api.put(`/campaigns/${id}`, campaignData);
};

export const deleteCampaign = (id) => {
  return api.delete(`/campaigns/${id}`);
};

// Advertisement API calls
export const getAdvertisements = (campaignId) => {
  return api.get(`/campaigns/${campaignId}/advertisements`);
};

export const getAdvertisement = (id) => {
  return api.get(`/advertisements/${id}`);
};

export const createAdvertisement = (campaignId, advertisementData) => {
  return api.post(`/campaigns/${campaignId}/advertisements`, advertisementData);
};

export const updateAdvertisement = (id, advertisementData) => {
  return api.put(`/advertisements/${id}`, advertisementData);
};

export const deleteAdvertisement = (id) => {
  return api.delete(`/advertisements/${id}`);
};

export default api;