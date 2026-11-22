
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

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

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


    if (name === 'email') {
      setOtp('');
      setOtpSent(false);
      setEmailVerified(false);
    }

    setError('');
    setMessage('');
  };

  const handleSendOtp = async () => {
    if (!formData.email.trim()) {
      setError('Please enter your email first.');
      return;
    }

    setOtpLoading(true);
    setError('');
    setMessage('');

    try {
        const resp = await userApi.post('/send-otp', {
          email: formData.email,
        });

      setOtpSent(true);
      setEmailVerified(false);
      setOtp('');

      setMessage(resp.data.message || 'OTP sent successfully!');
    } catch (err) {
      console.error('Send OTP failed:', err);

      setError(
        err.response?.data?.message ||
        'Unable to send OTP. Please try again.'
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError('Please enter OTP.');
      return;
    }

    setOtpLoading(true);
    setError('');
    setMessage('');

    try {
        const resp = await userApi.post('/verify-otp', {
          email: formData.email,
          otp: otp,
        });

      setEmailVerified(true);
      setMessage(resp.data.message || 'Email verified successfully!');
    } catch (err) {
      console.error('OTP verification failed:', err);

      setEmailVerified(false);

      setError(
        err.response?.data?.message || 'Invalid OTP. Please try again.'
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // REGISTER API
  const handleRegister = async (event) => {
    event.preventDefault();

    setMessage('');
    setError('');

    const errors = validateForm(formData, 'register');
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    // Email verification compulsory
    if (!emailVerified) {
      setError('Please verify your email before registration.');
      return;
    }

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
      setOtp('');
      setOtpSent(false);
      setEmailVerified(false);

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
        className="auth-modal auth-register-modal"
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
          <div className="auth-brand">
            <img
              className="auth-logo"
              src={website_Logo}
              alt="farmEra logo"
            />
            <span>farm<span>Era</span></span>
          </div>

          <div className="auth-heading">
            <span className="auth-eyebrow">
              JOIN THE FARMERA FAMILY
            </span>

            <h2>Create your account</h2>

            <p>
              Fresh groceries and everyday goodness, just a few steps away.
            </p>
          </div>

          <form onSubmit={handleRegister} noValidate>
            {/* NAME */}
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

            {/* EMAIL */}
            <div className="auth-field">
              <label htmlFor="auth-register-email">
                Email address
              </label>

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
              <button
                type="button"
                className="auth-submit"
                onClick={handleSendOtp}
                disabled={otpLoading || emailVerified}
              >
                {otpLoading
                  ? 'Please wait...'
                  : emailVerified
                  ? 'Email Verified ✓'
                  : otpSent
                  ? 'Resend OTP'
                  : 'Send OTP'}
              </button>
              {otpSent && (
            <p className="otp-info">
              Please check your inbox. If you don't receive the OTP,
              kindly check your Spam or Junk folder.
            </p>
            )}
            </div>
            {otpSent && !emailVerified && (
              <div className="auth-field">
                <label htmlFor="auth-otp">Enter OTP</label>

                <input
                  id="auth-otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                    setMessage('');
                  }}
                  maxLength={6}
                  inputMode="numeric"
                />

                <button
                  type="button"
                  className="auth-submit"
                  onClick={handleVerifyOtp}
                  disabled={otpLoading || otp.length !== 6}
                >
                  {otpLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            )}

            {emailVerified && (
              <p className="auth-success">
                Email verified successfully ✓
              </p>
            )}

            <div className="auth-field">
              <label htmlFor="auth-register-password">
                Password
              </label>

              <input
                id="auth-register-password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              {validationErrors.password && (
                <p className="auth-error">
                  {validationErrors.password}
                </p>
              )}
            </div>
            <div className="auth-field">
              <label htmlFor="auth-phone">Phone number</label>

              <input
                id="auth-phone"
                type="tel"
                name="phone_number"
                placeholder="Enter your 10-digit phone number"
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
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <span>→</span>}
            </button>

            {message && (
              <p className="auth-success">{message}</p>
            )}

            {error && (
              <p className="auth-error auth-message">{error}</p>
            )}

            <p className="auth-switch">
              Already have an account?

              <button
                type="button"
                onClick={() => navigate('/login')}
              >
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
