import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css'; // Assume a corresponding CSS file for styles
import heroImage from '../assets/images/hero-image.png';
import featuresImage from '../assets/images/features-image.jpg';
import testimonialsImage from '../assets/images/testimonials-image.jpg';
import footerLogo from '../assets/images/logo.png';

const Homepage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Puntualia</h1>
          <p>The ultimate booking system tailored for businesses to streamline appointments and boost productivity.</p>
          <Link to="/booking" className="cta-button">Get Started</Link>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Hero" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Puntualia?</h2>
        <div className="features-content">
          <div className="feature">
            <h3>Effortless Scheduling</h3>
            <p>Say goodbye to missed opportunities with an intuitive scheduling platform.</p>
          </div>
          <div className="feature">
            <h3>Customizable for Your Needs</h3>
            <p>Adaptable booking options to suit any industry or business size.</p>
          </div>
          <div className="feature">
            <h3>Secure & Reliable</h3>
            <p>Your data is protected with top-notch security measures.</p>
          </div>
        </div>
        <img src={featuresImage} alt="Features" className="features-image" />
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonials-content">
          <blockquote>
            <p>"Puntualia transformed the way we handle appointments. Our clients love it, and so do we!"</p>
            <cite>- Sarah, CEO of Bloom Wellness</cite>
          </blockquote>
          <blockquote>
            <p>"Scheduling has never been easier. Puntualia is an absolute game-changer for our business."</p>
            <cite>- John, Manager at TechHub</cite>
          </blockquote>
        </div>
        <img src={testimonialsImage} alt="Testimonials" className="testimonials-image" />
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <img src={footerLogo} alt="Puntualia Logo" className="footer-logo" />
          <p>© 2024 Puntualia. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
