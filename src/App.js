import React from 'react';
import AppointmentBooking from './components/AppointmentBooking';
import logo from "./assets/images/logo.png"
import './App.css';

function App() {
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
        <AppointmentBooking />
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 Your Business Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
