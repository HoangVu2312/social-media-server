// controller file for authentication

import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import User from "../models/User.js";

// REFISTER USER

export const register = async (req, res) => {
    try {
        // step 1: destructre properties from front-end
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            locations,
            occupation
        } = req.body;
        console.log(firstName, lastName, email, password);

        // step 2: hash password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // step 3: create a new User to save to db
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            locations,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        
        // step 4: send response to front-end
        res.status(201).json(savedUser);
        
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}

// LOGGING USER
export const login = async(req, res, next) => {
    try {
        // step 1: destructre properties from front-end
        const {email, password} = req.body;

        // step 2: chck if user exists in db
        const user = await User.findOne({email : email})
        if (!user) return res.status(400).json({msg : "User not exist !"});

        // step 3: check if password is correct
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) return res.status(400).json({ msg : "wrong password !"});

        // step 4: create token and delete password before send back to front end
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        delete user.password;

        // step 5: send back token and user properties without password
        res.status(200).json({token, user});
        
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}