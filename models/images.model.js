const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const imageSchema=new Schema({
    contentType:{
        type:String,
        required:true
    },
    data:{
        type:Buffer
    }
});

const imageModel=mongoose.model('images',imageSchema);
module.exports=imageModel;