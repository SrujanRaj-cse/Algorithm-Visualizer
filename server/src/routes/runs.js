const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const runController = require('../controllers/runController');

router.post('/saveInput', authenticate, runController.saveInput);
router.get('/list', authenticate, runController.listInputs);

module.exports = router;


