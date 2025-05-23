import Joi from 'joi';

// User registration validation schema
const registerValidation = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Username must be a string',
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least {#limit} characters long',
      'string.max': 'Username cannot be more than {#limit} characters long',
      'any.required': 'Username is required'
    }),
  
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,30}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must be between 6-30 characters and may contain letters, numbers, and special characters (!@#$%^&*)',
      'any.required': 'Password is required'
    })
});

// User login validation schema
const loginValidation = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// Todo creation validation schema
const todoValidation = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title cannot be more than {#limit} characters long',
      'any.required': 'Title is required'
    }),
  
  description: Joi.string()
    .allow('')
    .max(500)
    .optional()
    .messages({
      'string.max': 'Description cannot be more than {#limit} characters long'
    }),
  
  completed: Joi.boolean()
    .default(false),
  
  dueDate: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      'date.base': 'Due date must be a valid date',
      'date.format': 'Due date must be in ISO format'
    })
});

// Todo update validation schema
const todoUpdateValidation = Joi.object({
  id: Joi.number().required(),
  title: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title cannot be more than {#limit} characters long'
    }),
  
  description: Joi.string()
    .allow('')
    .max(500)
    .optional()
    .messages({
      'string.max': 'Description cannot be more than {#limit} characters long'
    }),
  
  completed: Joi.boolean()
    .optional(),
  
  dueDate: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      'date.base': 'Due date must be a valid date',
      'date.format': 'Due date must be in ISO format'
    })
});

export { registerValidation ,loginValidation, todoValidation, todoUpdateValidation };
