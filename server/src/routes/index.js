const express = require('express');
const router = express.Router();

// Existing algorithm routes are in ../utils/routes.js (legacy); if present, import and use
try {
  const legacy = require('../utils/routes');
  router.use('/', legacy);
} catch (e) {
  // ignore if not present
}

// You can add more grouped routes here
try {
  const runs = require('./runs');
  router.use('/runs', runs);
} catch (e) {}

module.exports = router;
