import User from "../models/User";
import bcrypt from "bcryptjs";

//CREATE USER
export const createUser = async (req, res) => {
    const { fullname, email, password, role} = req.body
        if(!fullname || !email || password || !role)
            return res.status(400).send({status: 'error', msg: 'required field must be filled'});
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                fullname,
                email,
                password: hashedPassword,
                role
            });
            return res.status(201).send({status: 'created', msg: 'successful created'});
        } catch (error) {
            console.error(error)
            return res.status(500).send({statu: 'error', msg: 'some error occurred'})
        }

};

// FETCH ALL USER
export const getUser = async (req, res) => {
    try {
        const user = await User.find()
    } catch (error) {
        
    }
}

