const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function signup(req, res){
    try{
        const {name, email, password} = req.body;

        const alreadyExist = await User.findOne({email});

        if (alreadyExist){
            return res.status(400).json({message: "Email already registered"});
        }

        const passwordHashed = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,    
            email: email,
            passwordHashed: passwordHashed,
    });

        await newUser.save();

        res.status(201).json({message: "New user created successfuly!"});

    }
    catch(error){
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function login(req, res) {
    try{
        const {email, password} = req.body;
        // console.log("Email:", email, "Password:", password)
        const user = await User.findOne({email})
        
        if (!user)
        {
            // console.log("No user found")
            return res.status(401).json({message: "Incorrect email or password"});
        }
        const isMatch = await bcrypt.compare(password, user.passwordHashed);
        if (!isMatch)
        {
            return res.status(401).json({message: "Incorrect email or password"});
        }
        
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.SECRET_KEY,
            {expiresIn: "1h"}
        );

        res.status(200).json({message: "Logged in successfuly!",
            token,
        user:{
            id: user._id,
            name: user.name, 
            email: user.email,
            pfp: user.pfp,
            bio: user.bio,
            followers: user.followers,
            following: user.following
        }});
    }
    catch(error){
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {signup, login}