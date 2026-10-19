
export const validateForm = (formData, mode = 'register') => {
  const errors = {};

  if (mode === 'register') {
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
  ) {
    errors.email = 'Enter a valid email';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (mode === 'register') {
    if (!formData.phone_number?.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^[6-9][0-9]{9}$/.test(formData.phone_number.trim())) {
      errors.phone_number = 'Enter a valid 10-digit Indian mobile number';
    }
  }

  return errors;
};
