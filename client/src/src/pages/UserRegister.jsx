import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import website_Logo from '../assets/logo.svg';
import '../components/userRegister.css';
import { validateForm } from '../utils/validation.js';
import { userApi } from '../api/axios.js';

function UserRegister({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationErrors((previous) => ({
      ...previous,
      [name]: '',
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setMessage('');
    setError('');

    const errors = validateForm(formData, 'register');
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const resp = await userApi.post('/register/user', formData);

      setMessage(resp.data.message || 'Registration successful!');

      setFormData({
        name: '',
        email: '',
        password: '',
        phone_number: '',
      });

      setValidationErrors({});
    } catch (err) {
      console.error('Registration failed:', err);

      setError(
        err.response?.data?.message ||
        (err.response
          ? 'Registration failed. Please check your details.'
          : 'Network Error: Unable to connect to the server.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Register"
      >
        <button
          type="button"
          className="auth-back"
          onClick={handleClose}
          aria-label="Close form"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="auth-content">
          <img className="auth-logo" src={website_Logo} alt="farmEra logo" />

          <h2>farmEra</h2>

          <p className="auth-title">
            Create your account and get fresh groceries at your doorstep
          </p>

          <form onSubmit={handleRegister} noValidate>
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {validationErrors.name && (
                <p className="auth-error">{validationErrors.name}</p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="auth-register-email">Email</label>
              <input
                id="auth-register-email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {validationErrors.email && (
                <p className="auth-error">{validationErrors.email}</p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="auth-register-password">Password</label>
              <input
                id="auth-register-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {validationErrors.password && (
                <p className="auth-error">{validationErrors.password}</p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="auth-phone">Phone number</label>
              <input
                id="auth-phone"
                type="tel"
                name="phone_number"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel"
              />
              {validationErrors.phone_number && (
                <p className="auth-error">
                  {validationErrors.phone_number}
                </p>
              )}
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Create Account'}
            </button>

            {message && <p className="auth-success">{message}</p>}
            {error && <p className="auth-error">{error}</p>}

            <p className="auth-switch">
              Already have an account?
              <button type="button" onClick={() => navigate('/login')}>
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
