const postRouter=require('express').Router();
const jwt=require('jsonwebtoken');
let Post=require('../models/post.model');
postRouter.route('/').get((req,res)=>{
    Post.find().populate('postedBy').then((posts)=>res.status(200).json(posts))
    .catch((e)=>res.status(500).json({message:e.toString()}))
});
postRouter.route('/add').post((req,res)=>{
    Post({
        content:req.body.content,
        createdBy: jwt.verify(req.header('authorization').split()[1],process.env.JWT_SECRET_KEY).userID
    }).save().then((post)=>res.status(200).json({message:'Post created'}))
    .catch(e=>res.status(500).json({message:e.toString()}));
});
modules.exports=postRouter