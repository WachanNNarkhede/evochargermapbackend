const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getStations,
  createStation,
  updateStation,
  deleteStation
} = require('../controllers/stationController');

router.get('/', authMiddleware, getStations);
router.post('/', authMiddleware, createStation);
router.put('/:id', authMiddleware, updateStation);
router.delete('/:id', authMiddleware, deleteStation);

module.exports = router;
