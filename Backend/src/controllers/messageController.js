/** @type {import("mongoose").Model<any>} */
const {default: Message} = require("../models/Message");

async function getMessages(req, res) {
    try {
        const otherUser = req.params.otherUserId;
        const messages = await Message.find(
            {
                $or:[
                    {sender: req.user._id, receiver: otherUser},
                    {sender: otherUser, receiver: req.user._id}
                ]
            }
        ).sort({createdAt: -1}).limit(50);
        return res.json(messages);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

async function sendMessage(req, res) {
    try {
        const {text} = req.body;
        const otherUser = req.params.otherUserId;
        const message = new Message({
            sender:req.user._id,
            receiver: otherUser,
            text: text});
        await message.save();
        return res.status(201).json(message);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

async function deleteMessage(req, res) {
    try {
        const message = await Message.findById(req.params.id);
        if (!message)
        {
            return res.status(404).json({message: "Message not found"});
        }
        if (String(message.sender) !== String(req.user._id))
        {
            return res.status(403).json({message: "User not allowed to delete this message"});
        }
        await message.deleteOne();
        return res.status(200).json({message: "Message deleted successfuly"});
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}


module.exports = {getMessages, sendMessage, deleteMessage}