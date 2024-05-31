const Comments = require('./../models/commentsModel');
const AppError = require('../utils/appError');

exports.getAllComments = async (req, res, next) =>{
    try{
        const comments = await Comments.find()
        res.status(200).json({data: comments, status: 'success'})
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.createComments = async (req, res) =>{
    try{
        const comments = await Comments.create(req.body);
        res.json({data: comments, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.getComments = async (req, res) =>{
    try{
        const comments = await Comments.findById(req.params.id);
        res.json({data: comments, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.updateComments = async (req, res) =>{
    try{
        const comments = await Comments.findByIdAndUpdate(req.params.id, req.body);
        res.json({data: comments, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.deleteComment = async (req, res) =>{
    try{
        const comments = await Commentsomments.findByIdAndDelete(req.params.id);
        res.json({data: comments, status: 'success'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
}
