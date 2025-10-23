import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from 'bcryptjs';

export const signup  = async (req,res) => {
    const {fullName, email, password} = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({message:"All fields must be filled."})
        }

        if(password.length < 8) {
            return res.status(400).json({message:"Password must be at least 8 characters."})
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if( !emailRegex.test(email)) {
            return res.status(400).json({message:"Invalid email format."})
        }

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message:"Email already exists."});

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password,
        })

        if(newUser) {
            // generateToken(newUser._id, res)
            // await newUser.save()
            const savesUser = await newUser.save();
            generateToken(savesUser._id, res)

            res.status(201).json({
                _id: newUser._id,
                fullName:newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            return res.status(400).json({message:"Invalid User Data."})
        }

    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const signin = async (req,res) => {
    res.send("Signin Page")
};

export const login = async (req,res) => {
    res.send("Login Page")
};