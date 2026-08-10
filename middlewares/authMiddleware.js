const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createError = require("../utils/createError");

const authMiddleware = async (req, res, next) => {
    console.log("authMiddleware called");

    try {

        const authHeader = req.headers.authorization;
        console.log("Authorization header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(
                createError("Unauthorized", 401)
            );
        }
        console.log("Authorization header is valid");
        const token = authHeader.split(" ")[1];
        console.log("Extracted token:", token);
        console.log("JWT secret:", process.env.JWT_SECRET);
        console.log("Verifying token...");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded token:", decoded);

        const user = await User.findById(decoded.id);
        console.log("Authenticated user:", user);

        if (!user) {
            return next(
                createError("Unauthorized", 401)
            );
        }

        req.user = user;

        next();

    } catch (error) {

        return next(
            createError("Unauthorized", 401)
        );

    }

};

module.exports = authMiddleware;