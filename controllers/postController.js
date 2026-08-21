const postService = require("../services/postService");
const createError = require("../utils/createError");


const getPosts = async (req, res, next) => {

    try {

        const page = Number(req.query.page) || 1;

        if (page < 1) {
            return next(
                createError("Page must be greater than 0", 400)
            );
        }

        const {
            totalPages,
            paginatedPosts,
            totalPosts
        } = await postService.getAllPosts(page);

        if (page > totalPages && totalPosts > 0) {
            return next(
                createError("Page not found", 404)
            );
        }

        res.status(200).json({
            currentPage: page,
            totalPages,
            posts: paginatedPosts
        });

    } catch (error) {
        next(error);
    }

};

const getPost = async (req, res, next) => {

    try {

        const id = req.id;

        const post = await postService.getPostById(id);

        if (!post) {
            return next(
                createError("Post not found", 404)
            );
        }

        res.status(200).json(post);

    } catch (error) {
        next(error);
    }

};

const createPost = async (req, res, next) => {

    try {

        if (Object.keys(req.body).length === 0) {
            return next(
                createError("Request body is required", 400)
            );
        }

        if (
            !req.body.title ||
            req.body.title.trim() === ""
        ) {
            return next(
                createError("Title is required", 400)
            );
        }

        const newPost = await postService.createPost(req.body, req.user._id);

        res.status(201).json(newPost);

    } catch (error) {
        next(error);
    }

};

const updatePost = async (req, res, next) => {

    try {

        const id = req.id;

        if (
            req.body.title !== undefined &&
            req.body.title.trim() === ""
        ) {
            return next(
                createError("Title cannot be empty", 400)
            );
        }

        const post = await postService.getPostById(id);

        if (!post) {
            return next(
                createError("Post not found", 404)
            );
        }

        if (post.author._id.toString() !== req.user._id.toString()) {
            return next(
                createError("Forbidden", 403)
            );
        }

        const updatedPost = await postService.updatePost(id, req.body);

        res.status(200).json(updatedPost);

    } catch (error) {
        next(error);
    }

};

const deletePost = async (req, res, next) => {

    try {

        const id = req.id;

        const post = await postService.getPostById(id);

        if (!post) {
            return next(
                createError("Post not found", 404)
            );
        }

        if (post.author._id.toString() !== req.user._id.toString()) {
            return next(
                createError("Forbidden", 403)
            );
        }

        await postService.deletePost(id);

        res.status(204).send();

    } catch (error) {
        next(error);
    }

};

module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
};