import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

function Login({ setLoggedIn }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    console.log('Attempting login with:', formData);

    if (!email || !password) {
      console.warn('Validation failed: Missing email or password');
      alert('Please fill in both fields.');
      return;
    }

    try {
      console.log('Sending credentials to Firebase...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      console.log('Login successful:', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      });

      alert(`Welcome back, ${email}!`);
      setLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.code, error.message);
      alert('Login failed: ' + error.message);
    } finally {
      console.log('Resetting form data after login attempt');
      setFormData({ email: '', password: '' });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-form-title">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="login-input"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="login-input"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className="login-submit" type="submit">Login</button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don’t have an account? <Link to="/admin/signup">Create One</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
