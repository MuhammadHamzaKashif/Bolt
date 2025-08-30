/** @type {import("mongoose").Model<any>} */

const User = require("../models/User")

async function getUser(req, res) {
    try {
        const user = await User.findById(req.user._id).select("-passwordHashed")
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        console.error("Error getting user:", error);
        return res.status(500).json({ message: "Server error" });
    }

}

async function updateUser(req, res) {
    try {
        const { name, bio } = req.body;
        let updateFields = {}
        if (name) updateFields.name = name;
        if (bio) updateFields.bio = bio;
        if (req.file && req.file.path) {
            updateFields.pfp = req.file.path;
        }
        console.log("Updating user:", {
            name,
            bio,
            pfp: updateFields.pfp,
        });
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateFields,
            { new: true },
        ).select("-passwordHashed")
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ user: updatedUser });

    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            console.error(error)
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        console.error("Error getting user:", error);
        return res.status(500).json({ message: "Server error" });
    }

}

async function deleteUser(req, res) {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfuly!" });
    } catch (error) {
        console.error("Error in deleteUser controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getUserByName(req, res) {
    try {
        const { name } = req.params;
        const users = await User.find({ name }).select("-passwordHashed -email")
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in getting users", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function followUser(req, res) {
    try {
        const currUserId = req.user._id;
        const { id: targetUserId } = req.params;
        if (targetUserId === String(currUserId)) {
            return res.status(400).json({ message: "Can not follow yourself" });
        }
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (targetUser.followers.includes(currUserId)) {
            await User.findByIdAndUpdate(
                targetUserId,
                {
                    $pull: { followers: currUserId }
                }
            );
            await User.findByIdAndUpdate(
                currUserId,
                {
                    $pull: { following: targetUserId }
                }
            );
            return res.status(200).json({ message: "User unfollowed successfuly!" });
        }
        else {
            await User.findByIdAndUpdate(
                targetUserId,
                {
                    $push: { following: currUserId }
                }
            );
            await User.findByIdAndUpdate(
                currUserId,
                {
                    $push: { followers: targetUserId }
                }
            );
            return res.status(200).json({ message: "User followed successfuly!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { getUser, updateUser, deleteUser, getUserByName, followUser }