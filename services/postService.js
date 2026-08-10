const Post = require("../models/Post");


const getAllPosts = async (page) => {

    const limit = 5;
    const skip = (page - 1) * limit;

    const paginatedPosts = await Post.find()
        .skip(skip)
        .limit(limit)
        .populate("author", "name email");

    const totalPosts = await Post.countDocuments();

    const totalPages = Math.ceil(totalPosts / limit);

    return {
        totalPages,
        paginatedPosts,
        totalPosts
    };

};


const getPostById = async (id) => {

    return await Post.findById(id).populate("author", "name email");

};


const createPost = async (body, userId) => {

    return await Post.create({
        title: body.title,
        content: body.content,
        author: userId
    });

};


const updatePost = async (id, body) => {

    const updatedPost = await Post.findByIdAndUpdate(

        id,

        body,

        {
            new: true,
            runValidators: true
        }

    );

    return updatedPost;

};


const deletePost = async (id) => {

    return await Post.findByIdAndDelete(id);

};


module.exports = {

    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost

};