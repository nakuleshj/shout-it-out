const postRouter=require('express').Router();
const jwt=require('jsonwebtoken');
let Post=require('../models/post.model');
postRouter.use((req,res,next)=>{
    
    if(req.header('authorization'))
    jwt.verify(req.header('authorization').split(' ')[1],process.env.JWT_SECRET_KEY,(err,user)=>{
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.userID = user.userID;
        // console.log(user.userID);
        next();
    });
    else {
        res.sendStatus(401);
    }
});
postRouter.route('/').get((req,res)=>{
    Post.find().populate('postedBy').then((posts)=>res.status(200).json(posts))
    .catch((e)=>res.status(500).json({message:e.toString()}))
});
postRouter.route('/like/:postID').post((req,res)=>{
    Post.findByIdAndUpdate(req.params.postID,{$push:{likers:req.userID}},(err,post)=>{
        if(err)
        res.sendStatus(500);
        else
        res.sendStatus(201);
    })
});
postRouter.route('/unlike/:postID').post((req,res)=>{
    Post.findByIdAndUpdate(req.params.postID,{$pull:{likers:req.userID}},(err,post)=>{
        if(err)
        res.sendStatus(500);
        else
        res.sendStatus(201);
    })
});
postRouter.route('/add').post((req,res)=>{
    Post({
        content:req.body.content,
        postedBy:req.userID
    }).save().then((post)=>res.status(200).json({message:'Post created'}))
    .catch(e=>res.status(500).json({message:e.toString()}));
});
module.exports=postRouter