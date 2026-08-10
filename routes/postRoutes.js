const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const validateId = require("../middlewares/validateId");

const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require("../controllers/postController");

router.get("/", getPosts);

router.get("/:id", validateId, getPost);

router.post("/", authMiddleware, createPost);

router.patch("/:id", authMiddleware, validateId, updatePost);

router.delete("/:id", authMiddleware, validateId, deletePost);

module.exports = router;