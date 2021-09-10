import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    colourScheme: {
        type: String,
        enum : ['PLACEHOLDER'],
        default: 'PLACEHOLDER'
    },
    tags: { 
        type: [String],
        required: true 
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
