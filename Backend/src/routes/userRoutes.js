const express = require("express")
const {getUser, updateUser, deleteUser, getUserByName, followUser} = require("../controllers/userController")
const {getUserPosts} = require("../controllers/postController")
const middleware = require("../middleware/authmiddleware")
const upload = require("../middleware/multer")
const router = express.Router();

router.get("/me", middleware, getUser);
router.put("/me", middleware, upload.single("pfp"), updateUser);
router.delete("/me", middleware, deleteUser);
router.get("/:name", getUserByName);
router.put("/:id/follow", middleware, followUser);
router.get("/:userId/posts", getUserPosts);

module.exports = router;