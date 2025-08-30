const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const commentRoutes = require("./routes/commentRoutes")
const messageRoutes = require("./routes/messageRoutes")
const cors = require("cors")

PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/post/:postId/comments", commentRoutes);
app.use("/message", messageRoutes);



connectDB().then(() =>{
    app.listen(PORT, () =>{
        console.log("Server started on port:", PORT)
    });
});
