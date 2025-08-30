const express = require("express")
const middleware = require("../middleware/authmiddleware");
const { getAllComments, postComment, updateComment, deleteComment } = require("../controllers/commentController");

const router = express.Router();

router.get("/", getAllComments)
router.post("/", middleware, postComment);
router.put("/:id", middleware, updateComment);
router.delete("/:id", middleware, deleteComment);


module.exports = router;