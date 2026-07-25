import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            unique: true,
            maxLength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
            index: true, // Faster queries ke liye database indexing
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters long"],
            select: false, // Security: Find queries mein password automatic return nahi hoga
        },
    },
    {
        timestamps: true, // Automatic createdAt aur updatedAt fields bana dega
        versionKey: false, // __v field ko remove karne ke liye
    }
);

export const User = mongoose.model("User", userSchema);