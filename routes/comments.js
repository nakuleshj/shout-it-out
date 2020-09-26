const commentRouter=require('express').Router();
let Comment=require('../models/comment.model');
commentRouter.route('/:postID').get((req,res)=>{
    Comment.find({commentedOn:req.params.postID}).populate('commentedBy').then((comments)=>res.status(200).json(comments))
    .catch((e)=>res.status(500).json({message:e.toString()}));
});
module.exports=commentRouter;