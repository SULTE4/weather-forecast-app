const Joi = require('joi');

// User registration validation schema
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

// User login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// Location validation schema
const locationSchema = Joi.object({
  city: Joi.string().required().messages({
    'any.required': 'City name is required',
  }),
  country: Joi.string().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  nickname: Joi.string().max(50).optional(),
  isFavorite: Joi.boolean().optional(),
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    next();
  };
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateLocation: validate(locationSchema),
};