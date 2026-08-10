const User = require("../models/User");

const findUserByEmail = async (email) => {

    return await User.findOne({ email });

};

const createUser = async (body) => {

    return await User.create({
        name: body.name,
        email: body.email,
        password: body.password
    });

};

module.exports = {
    findUserByEmail,
    createUser
};