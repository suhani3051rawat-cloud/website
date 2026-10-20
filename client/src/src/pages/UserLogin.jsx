import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import website_Logo from '../assets/logo.svg';
import '../components/userRegister.css';
import { validateForm } from '../utils/validation.js';
import { useAuth } from './AuthContext.jsx';

function UserLogin({ onClose }) {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      [name]: value
    }));

    setValidationErrors((previous) => ({
      ...previous,
      [name]: ''
    }));

    setLoginError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm(formData, 'login');
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setLoginError('');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const resp = await axios.post(
        `http://localhost:5000/user/Auth/login/user`,
        formData,
        {
          withCredentials: true
        }
      );

      setMessage(resp.data.message);
      setLoginError('');

      setFormData({
        email: '',
        password: ''
      });

      setValidationErrors({});

      await fetchUser();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);

      const payload = err.response?.data || err.message;
      setLoginError(payload?.message || err.message);
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
        aria-label="Login"
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
          <img
            className="auth-logo"
            src={website_Logo}
            alt="farmEra logo"
          />

          <h2>farmEra</h2>

          <p className="auth-title">
            Welcome back to your farmEra account
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="auth-login-email">Email</label>
              <input
                id="auth-login-email"
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
              <label htmlFor="auth-login-password">Password</label>
              <input
                id="auth-login-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {validationErrors.password && (
                <p className="auth-error">{validationErrors.password}</p>
              )}
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {message && (
              <p className="auth-success">{message}</p>
            )}

            {loginError && (
              <p className="auth-error">{loginError}</p>
            )}

            <p className="auth-switch">
              Don't have an account?
              <button
                type="button"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;