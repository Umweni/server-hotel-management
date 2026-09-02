import jwt from 'jsonwebtoken';
import User from '../models/User.js'


export const validate_user = async (req, res, next) => {
    let token;
    if(req.headers.authorization?.startsWith('Bearer')) {
     token = req.headers.authorization.split(" ")[1];
    }
    if(!token) {
        return res.status(401).send({status: 'error', msg: 'Not authorized'});
    }
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.status !== 'ACTIVE') {
        return res.status(401).send({status: 'error', msg: 'Not authorized'})
    }
    req.user = user;
    next();
}catch (error) {
    console.error(error);
    return res.status(401).send({status: 'error', msg: 'Not authorized'})
}

};

export default validate_user;