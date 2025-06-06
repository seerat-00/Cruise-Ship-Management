import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import './SignUp.css';

function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    if (formData.password !== formData.confirmPassword) {
      console.warn('Password mismatch');
      alert("Passwords do not match");
      return;
    }

    try {
      console.log('Attempting to create user...');
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('User created:', userCredential.user.uid);

      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      console.log('User profile updated with name:', formData.name);
      alert("Signup successful!");
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error.code, error.message);
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-form-title">Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="signup-input"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="signup-input"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="signup-input"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          className="signup-input"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button className="signup-submit" type="submit">Sign Up</button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/admin/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUpForm;
