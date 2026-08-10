const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authService = require("../services/authService");
const createError = require("../utils/createError");

const register = async (req, res, next) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(
                createError("All fields are required", 400)
            );
        }

        const existingUser = await authService.findUserByEmail(email);

        if (existingUser) {
            return next(
                createError("Email already exists", 400)
            );
        }

        const user = await authService.createUser(req.body);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        next(error);
    }

};

const login = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return next(
                createError("Email and password are required", 400)
            );
        }

        const user = await authService.findUserByEmail(email);

        if (!user) {
            return next(
                createError("Invalid email or password", 401)
            );
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return next(
                createError("Invalid email or password", 401)
            );
        }

        const token = jwt.sign(

            {
                id: user._id,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1h"
            }

        );

        res.status(200).json({

            message: "Login successful",

            token

        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    register,
    login
};