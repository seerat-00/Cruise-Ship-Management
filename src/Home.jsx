import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = ({ loggedIn }) => {
  useEffect(() => {
    console.log('Home component rendered. User logged in:', loggedIn);
  }, [loggedIn]);

  return (
    <div className="home-container">
      {/* Header with welcome message */}
      <header className="home-header">
        <h1>Welcome !</h1>
        <p>Access catering, reservations, and onboard services with ease.</p>
      </header>

      {/*  login/signup buttons if user is NOT logged in */}
      {!loggedIn && (
        <div className="home-button-group">
          <Link to="/admin/login" className="home-button">Login</Link>
          <Link to="/admin/signup" className="home-button">Sign Up</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
