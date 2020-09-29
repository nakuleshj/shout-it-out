const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    fullname:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    followers:[{
        type:String,
        ref:'users'
    }],
    following:[{
        type:String,
        ref:'users'
    }]
},{
    writeConcern:{
        j:true,
        wtimeout:1000
    },
    timestamps:true
});
const userModel=mongoose.model('users',userSchema);
module.exports=userModel;