const express = require("express")
const middleware = require("../middleware/authmiddleware");
const { getMessages, sendMessage, deleteMessage } = require("../controllers/messageController");

const router = express.Router();

router.get("/:otherUserId", middleware, getMessages)
router.post("/:otherUserId", middleware, sendMessage);
router.delete("/:id", middleware, deleteMessage);


module.exports = router;