
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import website_Logo from '../assets/logo.svg';
import '../components/userRegister.css';
import { validateForm } from '../utils/validation.js';
import { userRegister } from '../store/RegisterUserSlice.js';

function UserRegister({ onClose }) {
  const [mode, setMode] = useState('register');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const dispatch = useDispatch();

  const { loading, message, error } = useSelector(
    (state) => state.userRegister
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

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

  const handleRegister = async (event) => {
    event.preventDefault();

    const errors = validateForm(formData, 'register');
    setValidationErrors(errors);
    setLoginError('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const result = await dispatch(userRegister(formData));

      if (userRegister.fulfilled.match(result)) {
        setFormData({
          name: '',
          email: '',
          password: '',
          phone_number: ''
        });

        setValidationErrors({});
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const errors = validateForm(formData, 'login');
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setLoginError('');
      return;
    }

    setLoginError('Login API abhi connect nahi hai.');
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setValidationErrors({});
    setLoginError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      phone_number: ''
    });
  };

  const registerError =
    typeof error === 'string'
      ? error
      : error?.message || '';

  return (
    <div className="auth-overlay">
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'register' ? 'Register' : 'Login'}
      >
        <button
          type="button"
          className="auth-back"
          onClick={onClose}
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
            {mode === 'register'
              ? 'Create your account and get fresh groceries at your doorstep'
              : 'Welcome back to your farmEra account'}
          </p>

          {mode === 'register' ? (
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

              <button
                className="auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Create Account'}
              </button>

              {typeof message === 'string' && message && (
                <p className="auth-success">{message}</p>
              )}

              {registerError && (
                <p className="auth-error">{registerError}</p>
              )}

              <p className="auth-switch">
                Already have an account?
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                >
                  Login
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleLogin} noValidate>
              <div className="auth-field">
                <label htmlFor="auth-login-email">Email</label>
                <input
                  id="auth-login-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
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

              <button className="auth-submit" type="submit">
                Login
              </button>

              {loginError && (
                <p className="auth-error">{loginError}</p>
              )}

              <p className="auth-switch">
                Don't have an account?
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                >
                  Register
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
