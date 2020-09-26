const userRouter=require('express').Router();
let User=require('../models/user.model');
const jwt=require('jsonwebtoken');
const bCrypt=require('bcrypt');
userRouter.route('/login').post((req,res)=>{
    User.find({email:req.body.email}).then((user)=>{
        if(user.length==1)
        {
            if(bCrypt.compare(req.body.password,user[0].password))
                res.status(200).json({token:jwt.sign({'userID':user[0]._id},process.env.JWT_SECRET_KEY)})
            else
                res.status(401).json({message:'Email/Password is Invalid'});
        }
        else
        res.status(401).json({message:'Email/Password is Invalid'});
    });
});
userRouter.route('/register').post(async (req,res)=>{
    User(
        {
            email:req.body.email,
            password:await bCrypt.hash(req.body.password,10),
            username:req.body.username
        }
    ).save().then((user)=>{
        res.status(201).json({'token':jwt.sign({'userID':user._id},process.env.JWT_SECRET_KEY)})
    }).catch(e=>res.status(500).json({'message':e.toString()}));
});
module.exports=userRouter;