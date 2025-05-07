import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import CampaignList from './components/campaigns/CampaignList';
import CampaignDetail from './components/campaigns/CampaignDetail';
import CampaignForm from './components/campaigns/CampaignForm';
import AdvertisementList from './components/advertisements/AdvertisementList';
import AdvertisementForm from './components/advertisements/AdvertisementForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<CampaignList />} />
          <Route path="/campaigns/new" element={<CampaignForm />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/campaigns/:id/edit" element={<CampaignForm />} />
          <Route path="/campaigns/:campaignId/advertisements" element={<AdvertisementList />} />
          <Route path="/campaigns/:campaignId/advertisements/new" element={<AdvertisementForm />} />
          <Route path="/advertisements/:id/edit" element={<AdvertisementForm />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;