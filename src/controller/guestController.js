import jwt from "jsonwebtoken";
import Guest from "../models/Guest.js";
import User from "../models/User.js";

export const guestSignup = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).send({ success: false, message: "Name, email, and phone are required" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ success: false, message: "User already exists" });
    }

    // create guest profile
    const guest = await Guest.create({ name, email, phone, address });

    // create linked user
    const user = await User.create({
      fullname: name,
      email,
      role: "GUEST",
      status: "ACTIVE",
      guest: guest._id
    });

    // issue JWT
    const token = jwt.sign({ id: user._id, role: user.role, guestId: guest._id}, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).send({
      success: true,
      message: "Guest registered successfully",
      token,
      user: { id: user._id, fullname: user.fullname, role: user.role },
      guest: { id: guest._id, name: guest.name, email: guest.email}
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
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


export const guestLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, role: "GUEST" }).populate("guest");

    if (!user) {
      return res.status(404).send({ success: false, message: "Guest not found" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, guestId: user.guest._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.send({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, fullname: user.fullname, role: user.role },
      guest: { id: user.guest._id, name: user.guest.name, email: user.guest.email }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
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
