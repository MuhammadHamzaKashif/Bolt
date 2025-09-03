const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function authenticateUser(req, res, next) {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            console.log("No token provided")
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decoded.id);
        //         console.log("Decoded token:", decoded);
        // console.log("User from DB:", req.user);



        if (!req.user) {
            console.log("User not found")
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        console.error(error)
        return res.status(401).json({ message: 'Invalid token' });
    }
}

// module.exports = { authenticateUser };
