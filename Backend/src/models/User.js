const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        passwordHashed: {
            type: String,
            required: true,
        },
        pfp: {
            path: String,
        },
        bio: {
            type: String,
        },
        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;