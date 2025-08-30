const express = require("express")
const middleware = require("../middleware/authmiddleware")
const {getPosts, postPost, updatePost, deletePost, likePost} = require("../controllers/postController");
const upload = require("../middleware/multer")

const router = express.Router();

router.get("/", getPosts);
router.post("/post", middleware, upload.single("media"), postPost);
router.put("/:id", middleware, updatePost);
router.delete("/:id", middleware, deletePost);
router.put("/:id/like", middleware, likePost)



module.exports = router;