/** @type {import("mongoose").Model<any>} */
const Post = require("../models/Post");

async function getPosts(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const posts = await Post.find()
            .populate("user", "name pfp")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments();

        return res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function postPost(req, res) {
    try {
        const { caption } = req.body;
        let newPostData = {
            user: req.user._id,
            caption,
        }

        if (req.file && req.file.path)
        {
            newPostData.mediaPaths = req.file.path;
        }
        console.log("Creating post:", newPostData);
        const post = new Post(newPostData);
        await post.save();

        const populatedPost = await Post.findById(post._id).populate("user", "name pfp bio");
        res.status(201).json({post: populatedPost});
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function updatePost(req, res) {
    try {
        const { caption, mediaPaths } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (String(post.user) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to update this post" });
        }
        post.caption = caption ?? post.caption;
        post.mediaPaths = mediaPaths ?? post.mediaPaths;
        await post.save();
        return res.json(post);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function deletePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (String(post.user) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }
        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfuly!" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function likePost(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.user._id)) {
            await Post.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: { likes: req.user._id }
                }
            );
            return res.status(200).json({ message: "Post unliked successfuly" });
        }
        await Post.findByIdAndUpdate(
            req.params.id,
            {
                $push: { likes: req.user._id }
            }
        );
        return res.status(200).json({ message: "Post liked successfuly" });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

async function getUserPosts(req, res) {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ user: userId }) // <-- assumes your Post model has a "user" field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ user: userId });

    return res.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getPosts, postPost, updatePost, deletePost, likePost, getUserPosts }