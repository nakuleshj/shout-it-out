const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const postSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    postedBy:{
        type:String,
        required:true,
        ref:'users'
    }
},{
    writeConcern:{
        j:true,
        wtimeout:1000
    },
    timestamps:true
});

const postModel=mongoose.model('posts',postSchema);

module.exports=postModel;