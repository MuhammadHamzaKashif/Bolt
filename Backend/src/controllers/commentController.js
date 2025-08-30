/** @type {import("mongoose").Model<any>} */
const {default: Comment} = require("../models/Comment");
const { default: Post } = require("../models/Post");


async function getAllComments(req, res) {
    try {
        const allComments = []
        const post = await Post.findById(req.params.postId);
        if (!post)
        {
            return res.status(404).json({message: "Post not found"});
        }
        for (let i = 0; i < post.comments.length; i++)
        {
            const comment = await Comment.findById(post.comments[i]);
            allComments.push(comment);
        }
        return res.json(allComments);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

async function postComment(req, res) {
    try {
        const text = req.body;
        const postid = req.params.postId;
        const comment = new Comment({post:postid, user:req.user._id, text:text});
        await comment.save();
        return res.status(201).json(comment);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

async function updateComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment)
        {
            return res.status(404).json({message: "Comment not found"});
        }
        if (String(comment.user) !== String(req.user._id))
        {
            return res.status(403).json({message: "User not allowed to update this comment"});
        }
        comment.text = req.body ?? comment.text;
        await comment.save();
        res.status(200).json(comment);

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

async function deleteComment(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment)
        {
            return res.status(404).json({message: "Comment not found"});
        }
        if (String(comment.user) !== String(req.user._id))
        {
            return res.status(403).json({message: "User not allowed to delete this comment"});
        }
        await comment.deleteOne();
        return res.status(200).json({message: "Comment deleted successfuly"});
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}


module.exports = {getAllComments, postComment, updateComment, deleteComment}