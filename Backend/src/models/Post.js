const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        caption: {
            type: String,
        },
        mediaPaths: [{
            type: String,
        }],
        type: {
            type: String,
            enum: ["post", "bolt"],
            default: "post"
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }],

    },
    {
        timestamps: true,
    }
);


postSchema.pre("save", function (next) {
    if (this.mediaPaths && this.mediaPaths.length > 0) {
        const lastFile = this.mediaPaths[this.mediaPaths.length - 1];
        if (lastFile.match(/\.(mp4|mov|avi|mkv)$/i)) {
            this.type = "bolt";
        } else {
            this.type = "post";
        }
    }
    next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post