const Room = require("../models/Room");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("createdBy", "username");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await Room.findOne({ name });
    if (exists) return res.status(400).json({ message: "Room already exists" });

    const room = await Room.create({
      name, description,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};