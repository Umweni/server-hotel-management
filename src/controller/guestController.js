import Guest from "../models/Guest";

//create new guest
export const createGuest = async (req, res) => {
    try{
        const { name, email, phone, address } = req.body;
        const guest = new Guest({ name, email, phone, address });
        await guest.save();
        res.status(201).send({status: 'ok', msg: 'Guest created successfully', data: guest});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

//fetch all guest
export const getGuest = async (req, res) => {
    try {
        const guests = await Guest.find();
        res.status(200).send({status: 'ok', msg: 'Guests fetched successfully', data: guests});
    }
    catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

//fetch single guest by id
export const getGuestById = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id, req.body);
        res.status(200).send({status: 'ok', msg: 'Guest fetched successfully', data: guest});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

//update guest by id
export const updateGuest = async (req, res) => {
    try {
        const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).send({status: 'ok', msg: 'Guest updated successfully', data: guest});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

//delete guest by id
export const deleteGuest = async (req, res) => {
    try {
        const guest = await Guest.findByIdAndDelete(req.params.id);
        res.status(200).send({status: 'ok', msg: 'Guest deleted successfully', data: guest});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};  