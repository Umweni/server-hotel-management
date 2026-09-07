import Room from '../models/Room.js';

// Fetch all rooms
export const getRoom = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).send({ status: 'ok', msg: 'Rooms fetched successfully', data: rooms });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'error', msg: 'Some error occurred' });
  }
};

// Create room
export const createRoom = async (req, res) => {
  try {
    const { roomNumber, price, category, capacity, bedType, floor } = req.body;

    if (!roomNumber || !price || !category || !capacity || !bedType || !floor) {
      return res.status(400).send({ status: 'error', msg: 'Fill required fields' });
    }

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).send({ status: 'error', msg: 'Room number already exists' });
    }

    const room = new Room(req.body);
    await room.save();

    res.status(201).send({ status: 'ok', msg: 'Room created successfully', data: room });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'error', msg: 'Some error occurred' });
  }
};

// Get single room by ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).send({ status: 'error', msg: 'Room not found' });
    res.status(200).send({ status: 'ok', msg: 'Room found', data: room });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'error', msg: 'Server error' });
  }
};

// Update a room
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!room) return res.status(404).send({ status: 'error', msg: 'Room not found' });
    res.status(200).send({ status: 'ok', msg: 'Room updated successfully', data: room });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'error', msg: 'Server error' });
  }
};

// Get all available rooms
export const checkAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await Room.find({ status: "AVAILABLE" });
    res.status(200).send({ status: "ok", msg: "Available rooms fetched", data: availableRooms });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: "error", msg: "Server error" });
  }
};

// Check if a specific room is available
export const checkRoomAvailability = async (req, res) => {
  try {
    const { roomNumber } = req.params; // e.g. /api/rooms/available/31B
    const room = await Room.findOne({ roomNumber, status: "AVAILABLE" });

    if (!room) {
      return res.status(404).send({ status: "error", msg: "Room not available" });
    }

    res.status(200).send({ status: "ok", msg: "Room is available", data: room });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: "error", msg: "Server error" });
  }
};

// Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).send({ status: 'error', msg: 'Room not found' });
    res.status(200).send({ status: 'ok', msg: 'Room deleted successfully', data: room });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'error', msg: 'Server error' });
  }
};
