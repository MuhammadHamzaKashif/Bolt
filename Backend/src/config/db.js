const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGODB connected successfuly!");
    } catch (error) {
        console.error("Error connecting to MONGODB:", error);
        process.exit(1);
    }
}

module.exports = connectDB