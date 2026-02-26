export const registerValidation = {
  firstName: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'First name is required',
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'First name must be between 2 and 50 characters'
    }
  },
  lastName: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Last name is required',
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'Last name must be between 2 and 50 characters'
    }
  },
  email: {
    in: ['body'],
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Valid email is required'
  },
  password: {
    in: ['body'],
    isString: true,
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters'
    },
    matches: {
      options: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }
  },
  role: {
    in: ['body'],
    optional: true,
    isString: true
  },
  schoolId: {
    in: ['body'],
    optional: true,
    isMongoId: true
  }
};

export const loginValidation = {
  email: {
    in: ['body'],
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Valid email is required'
  },
  password: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Password is required'
  }
};

export const changePasswordValidation = {
  oldPassword: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Current password is required'
  },
  newPassword: {
    in: ['body'],
    isString: true,
    isLength: {
      options: { min: 8 },
      errorMessage: 'New password must be at least 8 characters'
    },
    matches: {
      options: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }
  }
};

export const forgotPasswordValidation = {
  email: {
    in: ['body'],
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Valid email is required'
  }
};

export const resetPasswordValidation = {
  token: {
    in: ['body'],
    isString: true,
    notEmpty: true,
    errorMessage: 'Reset token is required'
  },
  newPassword: {
    in: ['body'],
    isString: true,
    isLength: {
      options: { min: 8 },
      errorMessage: 'New password must be at least 8 characters'
    }
  }
};