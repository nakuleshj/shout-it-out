const bodyParser = require('body-parser');

const express=require('express');
const app=express();
const cors=require('cors');
const path=require('path');
const mongoose=require('mongoose');
require('dotenv').config();
app.use(cors());
app.use(express.json());
const userRouter=require('./routes/users');
const postRouter=require('./routes/posts');
const commentRouter=require('./routes/comments');
app.use('/api/comment',commentRouter);
app.use('/api/auth',userRouter);
app.use('/api/post',postRouter);
const uri=process.env.ATLAS_URI
mongoose.connect(uri,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true});

    app.use(express.static(path.join(__dirname,'/client/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'/client/build','index.html'));
    });
const port=process.env.PORT||5000;
app.listen(port,()=>{
    console.log('Server running on Port '+port);
})