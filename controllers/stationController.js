const ChargingStation = require('../models/ChargingStation');

// 🟢 Get all stations (with optional query filters)
exports.getStations = async (req, res) => {
  try {
    const filters = {};

    // Optional filters from query params
    if (req.query.status) filters.status = req.query.status;
    if (req.query.connectorType) filters.connectorType = req.query.connectorType;
    if (req.query.powerOutput) filters.powerOutput = { $gte: parseFloat(req.query.powerOutput) };

    const stations = await ChargingStation.find(filters);
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stations', error: err.message });
  }
};

// 🟢 Create new station
exports.createStation = async (req, res) => {
  try {
    const { name, latitude, longitude, status, powerOutput, connectorType } = req.body;

    const newStation = new ChargingStation({
      name,
      latitude,
      longitude,
      status,
      powerOutput,
      connectorType,
      createdBy: req.user.id, // from JWT middleware
    });

    await newStation.save();
    res.status(201).json({ message: 'Charging station created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create station', error: err.message });
  }
};

// 🟡 Update station
exports.updateStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);

    if (!station) return res.status(404).json({ message: 'Station not found' });
    if (station.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized to update this station' });

    const updated = await ChargingStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Station updated', station: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update station', error: err.message });
  }
};

// 🔴 Delete station
exports.deleteStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);

    if (!station) return res.status(404).json({ message: 'Station not found' });
    if (station.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized to delete this station' });

    await ChargingStation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Station deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete station', error: err.message });
  }
};
