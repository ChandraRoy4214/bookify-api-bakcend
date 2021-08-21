// ======================================================================
// this middleware helps in protecting and authorizing private routes
// ======================================================================

const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncWrapper');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
         token = req.headers.authorization.split(' ')[1]; 
  }
  // Set token from cookie

      // else if (req.cookies.token) {
      //   token = req.cookies.token;
      // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse(401, 'Not authorized to access this route'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse(401, 'Not authorized to access this route'));
  }
});


// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(403, 
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};