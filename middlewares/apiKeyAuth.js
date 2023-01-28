const config = require('../config');

function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!config.apiKey) {
    return next();
  }

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required. Provide via x-api-key header or apiKey query param.',
    });
  }

  if (apiKey !== config.apiKey) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API key.',
    });
  }

  next();
}

module.exports = apiKeyAuth;
