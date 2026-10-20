import mongoose from "mongoose";

let userSchema = mongoose.Schema({
    name:{
        type      : String,
        required  : true,
        trim      : true
    },
    email:{
        type      : String,
        required  : true,
        unique    : true,
        trim      : true
    },
    password:{
        type      : String,
        required  : true,
        trim      : true
    },
    phone_number:{
        type      : String,
        required  : true,
        trim      : true,
    },
    status:{
        type      : Number,
        default   : 0
    },
    isDelete:{
        type      : Boolean,
        default   : false
    },
}, 
{
    timestamps: true
});
export const userRegisterModel = mongoose.model("userRegister", userSchema);