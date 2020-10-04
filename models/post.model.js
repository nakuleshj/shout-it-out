const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const postSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    imageRef:{
        type:String,
        ref:'images'
    },
    postedBy:{
        type:String,
        required:true,
        ref:'users'
    },
    likers:[{
        type:String,
        ref:'users'
    }],
    comments:[{
        type:String,
        ref:'comments'
    }]
},{
    writeConcern:{
        j:true,
        wtimeout:1000
    },
    timestamps:true
});

const postModel=mongoose.model('posts',postSchema);

module.exports=postModel;