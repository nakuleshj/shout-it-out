const userRouter=require('express').Router();
let User=require('../models/user.model');
let Image=require('../models/images.model');
const jwt=require('jsonwebtoken');
const bCrypt=require('bcrypt');
const multer=require('multer');
const upload=multer({dest:'./public/uploads/'});
const fs=require('fs');
userRouter.route('/login').post((req,res)=>{
    User.find({email:req.body.email}).then((user)=>{
        if(user.length==1)
        {
            if(bCrypt.compare(req.body.password,user[0].password))
                res.status(200).json({token:jwt.sign({'userID':user[0]._id},process.env.JWT_SECRET_KEY),userID:user[0]._id})
            else
                res.status(401).json({message:'Email/Password is Invalid'});
        }
        else
        res.status(401).json({message:'Email/Password is Invalid'});
    });
});
userRouter.route('/getProfilePic/:userId').get((req,res)=>{
    User.findById(req.params.userId).populate('avatar').then((user)=>{
        res.json({imageSrc:'data:'+user.avatar.contentType+';base64,'+user.avatar.data});
    })
})
userRouter.route('/register').post(upload.single('avatar'),async (req,res)=>{
    const img=fs.readFileSync(req.file.path);
    const imageDoc=await Image({
        contentType:req.file.mimetype,
        data:img.toString('base64')
    }).save();
    User(
        {
            email:req.body.email,
            password:await bCrypt.hash(req.body.password,10),
            fullname:req.body.fullname,
            avatar:imageDoc._id
        }
    ).save().then((user)=>{
        fs.unlinkSync(req.file.path);
        res.status(201).json({token:jwt.sign({'userID':user._id},process.env.JWT_SECRET_KEY),userID:user._id})
    }).catch(e=>{
        console.log(e.toString());
        res.status(500).json({'message':e.toString()})});
});
userRouter.route('/resetPassword').post(async (req,res)=>{
    const userID=jwt.verify(req.header('authorization').split(' ')[1],process.env.JWT_SECRET_KEY).userID;
    const user= await User.findById(userID);
    if(bCrypt.compareSync(req.body.currentPassword,user.password))
        User.findByIdAndUpdate(jwt.verify(req.header('authorization').split(' ')[1],process.env.JWT_SECRET_KEY).userID,{password:bCrypt.hashSync(req.body.newPassword)})
        .then((user)=>{res.sendStatus(200)})
        .catch((e)=>{res.sendStatus(500)});
    else
        res.sendStatus(400)
});
userRouter.route('/follow/:followUserID').post((req,res)=>{
    const userID=jwt.verify(req.header('authorization').split(' ')[1],JWT_SECRET_KEY).userID
    User.findByIdAndUpdate(req.params.followUserID,{$push:{
        'followers':userID
    }}).then((user)=>{
        User.findByIdAndUpdate(userID,{$push:{
            following:req.params.followUserID
        }}).then(()=>{
            res.sendStatus(201);
        }).catch((e)=>{
            res.sendStatus(500)
        })
    }).catch((e)=>{
        res.sendStatus(500)
    })
});
userRouter.route('/unfollow/:unfollowUserID').post((req,res)=>{
    const userID=jwt.verify(req.header('authorization').split(' ')[1],JWT_SECRET_KEY).userID;
    User.findByIdAndUpdate(req.params.unfollowUserID,{$pull:{
        'followers':userID
    }}).then((user)=>{
        User.findByIdAndUpdate(userID,{$pull:{
            following:req.params.followUserID
        }}).then(()=>{
            res.sendStatus(201);
        }).catch((e)=>{
            res.sendStatus(500)
        })
    }).catch((e)=>{
        res.sendStatus(500)
    })
});
userRouter.route('/updateUser').post((req,res)=>{
    User.findByIdAndUpdate(jwt.verify(req.header('authorization').split(' ')[1],process.env.JWT_SECRET_KEY).userID,{
        fullname:req.body.newFullname,
        email:req.body.newEmail
    }).then(()=>{
        res.sendStatus(200);
    }).catch((e)=>{
        res.sendStatus(500);
    })
})
userRouter.route('/getUserDetails').get((req,res)=>{
    User.findById(jwt.verify(req.header('authorization').split(' ')[1],process.env.JWT_SECRET_KEY).userID).populate('avatar').then((user)=>res.status(200).json(user)).catch((e)=>res.sendStatus(404))
})
module.exports=userRouter;