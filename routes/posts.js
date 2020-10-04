const postRouter=require('express').Router();
const jwt=require('jsonwebtoken');
const multer  = require('multer');
const upload=multer({'dest':'./public/uploads/'});
const fs=require('fs');
let Post=require('../models/post.model');
let Comment=require('../models/comment.model');
let Image=require('../models/images.model');
postRouter.use((req,res,next)=>{
    if(req.header('authorization'))
    jwt.verify(req.header('authorization').split(' ')[1],process.env.JWT_SECRET_KEY,(err,user)=>{
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.userID = user.userID;
        next();
    });
    else {
        res.sendStatus(401);
    }
});

postRouter.route('/media').post(upload.single('postImage'),(req,res)=>{
    console.log(req.file.path)
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    Image({
        contentType:req.file.mimetype,
        data:encode_image
    }).save().then((newImg)=>{
        console.log(newImg._id);
        Post({
            postedBy:req.userID,
            content:req.body.content,
            imageRef:newImg._id
        }).save().then(()=>{
            fs.unlinkSync(req.file.path);
            res.sendStatus(201);
        })
    });
    
});
postRouter.route('/').get((req,res)=>{
    Post.find().populate('postedBy imageRef').populate({path:'comments',populate:'commentedBy'}).then((posts)=>res.status(200).json(posts))
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
postRouter.route('/:postID').delete(async (req,res)=>{
    // const post=await Post.findById(req.params.postID);
    Post.findByIdAndDelete(req.params.postID).then((post)=>{
        Comment.deleteMany({_id:post.comments}).then(()=>{
            res.sendStatus(200);
        }).catch((e)=>{res.sendStatus(500)});
    }).catch((e)=>{res.sendStatus(500)});
});
postRouter.route('/comment/:postID').post(async (req,res)=>{
    const newComment=new Comment({
        commentedBy:req.userID,
        commentedOn:req.params.postID,
        commentContent:req.body.commentContent
    });
    try{
    const comment=await newComment.save();
    Post.findByIdAndUpdate(req.params.postID,{
        $push:{comments:comment._id}
    }).then((post)=>{
        res.sendStatus(201);
    })} catch(e){
        res.sendStatus(500);
    }
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