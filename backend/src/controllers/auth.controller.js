import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from 'bcryptjs';
import cloudinary from "../lib/cloudinary.js";

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
            password: hash,
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

export const login = async (req,res) => {
    const {email, password} = req.body;

    if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({message: "Invalid Credentials"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"});

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.error("Error in login controller:",error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const logout = async (_, res) => {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message: "Logged out successfully"});
};

export const updateProfile = async(req, res) => {
    try {
        const {profilePic} = req.body;
        if(!profilePic) return res.status(400).json({message: "Profile Picture is required"});

        const userId = req.user._id;

        const uploadResponse = cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url},
            { new: true }
        );

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in Updating Profile",error);
        return res.status(500).json({message: "internal Server Error"});
    }
};