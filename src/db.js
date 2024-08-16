import mongoose from "mongoose";

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/swoc")
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

// Define the schema
const logSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

// Create a model
const Collection = mongoose.model("User", logSchema);

export default Collection;
