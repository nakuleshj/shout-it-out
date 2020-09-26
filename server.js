const bodyParser = require('body-parser');

const express=require('express');
const app=express();
const cors=require('cors');
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
app.listen(process.env.PORT||5000,()=>{
    console.log('Server running on Port 5000');
})