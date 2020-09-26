const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const commentSchema=new Schema({
    commentContent:{
        type:String,
        required:true
    },
    commentedOn:{
        type:String,
        required:true,
        ref:'posts'
    },
    commentedBy:{
        type:String,
        required:true,
        ref:'users'
    }
},{
    timestamps:true,
    writeConcern:{
        j:true,
        wtimeout:1000
    }
});
const commentModel=mongoose.model('comments',commentSchema);
module.exports=commentModel;