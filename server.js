const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

};

startServer();