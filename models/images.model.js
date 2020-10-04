const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const imageSchema=new Schema({
    contentType:{
        type:String,
        required:true
    },
    data:{
        type:String
    }
});

const imageModel=mongoose.model('images',imageSchema);
module.exports=imageModel;