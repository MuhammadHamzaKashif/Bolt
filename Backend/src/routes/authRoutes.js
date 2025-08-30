const express = require("express")
const {signup, login} = require("../controllers/authController");
const authenticateUser = require("../middleware/authmiddleware")

router = express.Router();

router.get("/verify", authenticateUser, (req, res) => {
    res.json({
        message: "Token is valid",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        },
    });
});
router.post("/signup", signup);
router.post("/login", login)


module.exports = router;