// models/ChargingStation.js
const mongoose = require('mongoose');

const ChargingStationSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  status: { type: String, enum: ['active', 'inactive'] },
  powerOutput: Number, 
  connectorType: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChargingStation', ChargingStationSchema);
