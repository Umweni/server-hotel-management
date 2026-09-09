import Guest from '../models/Guest.js';

// Create new guest
export const createGuest = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "Name, email, and phone are required" });
    }

    const existingGuest = await Guest.findOne({ email });
    if (existingGuest) {
      return res.status(409).json({ success: false, message: "Guest with this email already exists" });
    }

    const guest = await Guest.create({ name, email, phone, address });

    return res.status(201).json({
      success: true,
      message: "Guest created successfully",
      guest: {
        id: guest._id,
        name: guest.name,
        email: guest.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Fetch all guests
export const getGuest = async (req, res) => {
  try {
    const guests = await Guest.find();
    res.status(200).send({ status: 'ok', msg: 'Guests fetched successfully', data: guests });
  } catch (error) {
    res.status(500).send({ status: 'error', msg: error.message });
  }
};

// Fetch single guest by ID
export const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).send({ status: 'error', msg: 'Guest not found' });
    }
    res.status(200).send({ status: 'ok', msg: 'Guest fetched successfully', data: guest });
  } catch (error) {
    res.status(500).send({ status: 'error', msg: error.message });
  }
};

// Update guest by ID
export const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!guest) {
      return res.status(404).send({ status: 'error', msg: 'Guest not found' });
    }
    res.status(200).send({ status: 'ok', msg: 'Guest updated successfully', data: guest });
  } catch (error) {
    res.status(500).send({ status: 'error', msg: error.message });
  }
};

// Delete guest by ID
export const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) {
      return res.status(404).send({ status: 'error', msg: 'Guest not found' });
    }
    res.status(200).send({ status: 'ok', msg: 'Guest deleted successfully', data: guest });
  } catch (error) {
    res.status(500).send({ status: 'error', msg: error.message });
  }
};
