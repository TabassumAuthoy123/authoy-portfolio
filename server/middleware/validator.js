const { body, validationResult } = require('express-validator');

// Middleware to run validations and check results
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errorMessages,
    });
  };
};

// Auth validation rules
const loginRules = [
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordRules = [
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
];

const verifyOtpRules = [
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits'),
];

const resetPasswordRules = [
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('New password must contain at least one special character'),
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('New password must contain at least one special character'),
];

// Content validation rules
const projectRules = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').trim().notEmpty().withMessage('Project description is required'),
  body('techStack').isArray({ min: 1 }).withMessage('At least one technology must be listed'),
  body('sourceUrl').optional({ checkFalsy: true }).isURL().withMessage('Please enter a valid URL'),
  body('liveUrl').optional({ checkFalsy: true }).isURL().withMessage('Please enter a valid URL'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
];

const skillRules = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('category')
    .isIn(['frontend', 'backend', 'language', 'database', 'tool'])
    .withMessage('Invalid skill category'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
];

const experienceRules = [
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('company').trim().notEmpty().withMessage('Company or institution is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('type').isIn(['work', 'education']).withMessage('Type must be either work or education'),
  body('description').optional().isArray().withMessage('Description must be an array of strings'),
  body('gpa').optional().trim(),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
];

const achievementRules = [
  body('title').trim().notEmpty().withMessage('Achievement title is required'),
  body('category')
    .isIn(['competition', 'cp', 'leadership', 'education'])
    .withMessage('Invalid achievement category'),
  body('date').optional().trim(),
  body('description').optional().trim(),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
];

const leadershipRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('role').optional().trim(),
  body('organization').optional().trim(),
  body('date').optional().trim(),
  body('description').optional().trim(),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
];

const articleRules = [
  body('title').trim().notEmpty().withMessage('Article title is required'),
  body('content').notEmpty().withMessage('Article content is required'),
  body('excerpt').optional().trim(),
  body('category').trim().notEmpty().withMessage('Article category is required'),
  body('readTime').optional().trim(),
  body('published').optional().isBoolean().withMessage('Published status must be a boolean'),
];

const galleryRules = [
  body('title').trim().notEmpty().withMessage('Gallery item title is required'),
  body('imageUrl').notEmpty().withMessage('Image URL/path is required'),
  body('category').trim().notEmpty().withMessage('Gallery category is required'),
  body('description').optional().trim(),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
];

const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message content is required'),
];

const clientRules = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('contactName').trim().notEmpty().withMessage('Contact name is required'),
  body('contactEmail').isEmail().withMessage('Please enter a valid contact email').normalizeEmail(),
  body('plan').isIn(['starter', 'professional', 'enterprise']).withMessage('Plan must be starter, professional, or enterprise'),
  body('status').isIn(['active', 'inactive', 'suspended', 'trial']).withMessage('Status must be active, inactive, suspended, or trial'),
];

module.exports = {
  validate,
  loginRules,
  forgotPasswordRules,
  verifyOtpRules,
  resetPasswordRules,
  changePasswordRules,
  projectRules,
  skillRules,
  experienceRules,
  achievementRules,
  leadershipRules,
  articleRules,
  galleryRules,
  contactRules,
  clientRules,
};
