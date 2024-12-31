import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import AppointmentBooking from './components/AppointmentBooking';
import logo from './assets/images/logo.png';
import './App.css';
import UserInfoForm from './components/UserInfoForm'; // Import the new form component

function App() {
  const [userInfo, setUserInfo] = useState(null); // State to store user info
  const handleUserInfoSubmit = (info) => {
    setUserInfo(info); // Store user info after submission
  };
  const history = useHistory();

useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');  // Extract 'slug' query param

    const checkSlugValidity = async () => {
      if (!slug) {
        // No slug provided, redirect to homepage
        history.push('/homepage');
        return;
      }

      try {
        // Check if the slug exists in the system (using the API)
        const response = await axios.get(`/api/check-username?slug=${slug}`);
        
        if (response.status !== 200 || !response.data.exists) {
          // Invalid slug, redirect to homepage
          history.push('/homepage');
        }
      } catch (error) {
        // Error in checking slug, redirect to homepage
        history.push('/homepage');
      }
    };

    checkSlugValidity();
  }, [history]);
  return (
    <BrowserRouter> {/* Wrap your app in BrowserRouter */}
      <div className="app-container">
        <header className="app-header">
          <img src={logo} alt="Logo" className="app-logo" />
          <h1>Customer Appointment Dashboard</h1>
          <p className="app-subheader">
            Book your preferred service and time effortlessly.
          </p>
        </header>
        <main className="dashboard">
        {userInfo ? (
          <AppointmentBooking userInfo={userInfo} /> // Pass user info to AppointmentBooking
        ) : (
          <UserInfoForm onSubmit={handleUserInfoSubmit} /> // Show form if no user info
        )}
      </main>
        <footer className="app-footer">
          <p>&copy; 2024 Your Business Name. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter> 
  );
}

export default App;
