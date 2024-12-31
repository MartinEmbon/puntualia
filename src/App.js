import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';

import AppointmentBooking from './components/AppointmentBooking';
import UserInfoForm from './components/UserInfoForm';
import Homepage from './components/Homepage';
import logo from './assets/images/logo.png';
import './App.css';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleUserInfoSubmit = (info) => {
    setUserInfo(info);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug'); // Extract 'slug' query param

    const checkSlugValidity = async () => {
      if (!slug) {
        // No slug provided, redirect to homepage
        navigate('/');
        return;
      }

      try {
        // Check if the slug exists in the system (using the API)
        const response = await axios.get(`https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/check-user-for-queryparams?slug=${slug}`);
        
        if (response.status !== 200 || !response.data.exists) {
          // Invalid slug, redirect to homepage
          navigate('/');
        }
      } catch (error) {
        // Error in checking slug, redirect to homepage
        navigate('/');
      }
    };

    checkSlugValidity();
  }, [navigate]);

  return (
    <div className="app-container">
      <header className="app-header">
        <img src={logo} alt="Logo" className="app-logo" />
        <h1>Customer Appointment Dashboard</h1>
        <p className="app-subheader">
          Book your preferred service and time effortlessly.
        </p>
      </header>
      
      <main className="dashboard">
        <Routes>
          <Route path="/" element={<Homepage />} /> {/* Homepage is now the default route */}
          <Route path="/booking" element={userInfo ? (
            <AppointmentBooking userInfo={userInfo} />
          ) : (
            <UserInfoForm onSubmit={handleUserInfoSubmit} />
          )} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Your Business Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default WrappedApp;
