const mongoose = require("mongoose");
const createError = require("../utils/createError");

function validateId(req, res, next) {

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {

        return next(
            createError("Invalid ID", 400)
        );

    }

    req.id = id;

    next();

}

module.exports = validateId;