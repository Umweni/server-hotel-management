import User from "../models/User";
import bcrypt from "bcryptjs";



//REGISTER USER
export const registerUser = async (req, res) => {
    const { fullname, email, password, role} = req.body
        if(!fullname || !email || !password || !role)
            return res.status(400).send({status: 'error', msg: 'required field must be filled'});
        try {
            //check if email already exists
            const existingUser = await User.findOne({ email });
            if(existingUser){
                return res.status(400).send({status: 'error', msg: 'Email already existed'});

            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                fullname,
                email,
                password: hashedPassword,
                role,
                status: 'ACTIVE'
            });
            return res.status(201).send({status: 'ok', msg: 'successful created'});
        } catch (error) {
            console.error(error)
            return res.status(500).send({status: 'error', msg: 'some error occurred'})
        }

};

// FETCH ALL USERS
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({createAt: -1});
        return res.status(200).send({status: 'ok', msg: 'success', data: users});
    } catch (error) {
        console.log(error);
        return res.status(500).send({status: 'error', msg: 'server error'})
    }
};

//UPDATE USER BY ID
export const updateUser = async (req, res) => {
try {
        let updateData = {...req.body};

    //if password is being updated hash it
    if(updateData.password){
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt)
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,  // return updated document
        runValidators: true // enforce schema validation
    });

    if (!user) {
        return res.status(404).send({ status: 'error', msg: 'User not found'});
    }
    return res.status(200).send({status: 'ok', msg: 'success', data: user});
} catch (error) {
    console.log(error);
    return res.status(500).send({status: 'error', msg: 'some error occurred'});
}
}

//DELETE USER BY ID
export const deleteUser = async (req, res) => {
    try {
        if(req.User.role !== req.params.id){
            return res.status(403).send({status: 'error', msg: 'Access denied'});
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) {
            return res.status(404).send({status: 'error', msg: 'User not found'});
        }
        return res.status(200).send({status: 'ok', msg: 'successfully deleted'});
    } catch (error) {
        console.error(error);
        return res.status(500).send({status: 'error', msg: 'server error'});
    }
}


