const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.send('This is the documentation root');
});

router.get('/frontend', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../docs/frontend/global.html'));
});

router.get('/backend', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../docs/backend/global.html'));
});

module.exports = router;