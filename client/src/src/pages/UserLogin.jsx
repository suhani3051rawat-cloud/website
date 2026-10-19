
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import website_Logo from '../assets/logo.svg';
import '../components/userRegister.css';

function UserLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert('Login API abhi connect nahi hai.');
  };

  return (
    <div className="main-container">
      <div className="userRegisterForm">
        <img src={website_Logo} alt="farmEra logo" />
        <h3>farmEra</h3>

        <p className="title">
          Login to your farmEra account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="input"
              type="email"
              name="email"
              value={formData.email}
              placeholder="name@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="input"
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="button">
            Login
          </button>

          <p className="footerText">
            Don't have an account?
            <button
              type="button"
              className="link"
              onClick={() => navigate('/register')}
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
