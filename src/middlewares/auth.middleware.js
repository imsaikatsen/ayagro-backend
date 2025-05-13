// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

class AuthMiddleware {
  authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided!' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info (id, email, role, etc.)
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token!' });
    }
  }

  authorizeRoles(...roles) {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: 'Forbidden: You do not have access!' });
      }
      next();
    };
  }
}

module.exports = new AuthMiddleware();
