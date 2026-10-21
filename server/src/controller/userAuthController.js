import { userRegisterModel } from "../model/userRegisterModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { addressModel } from "../model/storeUserMultipleAddress.js";

export const userRegister = async (req,res)=>{ 
 try {
    let{name, email, password, phone_number} = req.body;
    let findUser = await userRegisterModel.findOne({
        email,
        });
    if(findUser){
         return res.status(400).json({
            message : "Email already exist"
        }); 
    }
    let phone_numberCheck  = (phone_number)=>{
            let firstDigit =  phone_number[0];
            let values = ['6','7','8','9']
            if(values.includes(firstDigit)){
                return true;
            }
            else {
                return false;
            }   
        }
        if(!phone_numberCheck(phone_number)){
            return res.status(400).json({
                message : "Please enter a valid phone number"
            });
        }
    let hashPassword = await bcrypt.hash(password,10);
    const user =  await userRegisterModel.create({
        name,
        email,
        password : hashPassword,
        phone_number,
    });
    const registeredUser = await userRegisterModel.findById(user._id).select('-password -__v');
    return res.json({
        message : "User register successfully",
        Data    :  registeredUser
    });
    } 
    catch (error) {console.log(error)
       return res.status(500).json({
            message : "User not Register",
            error : error.message
        });
    }
}
export const userLogin = async (req,res)=>{
    try {
        let {email, password} = req.body;
        let findUser = await userRegisterModel.findOne({
            email
        });
        if(!findUser){
            return res.status(500).json({
                 message : "User not found"
            });
        }
        let passwordCheck = await bcrypt.compare(password, findUser.password);
        if(!passwordCheck){
            return res.status(400).json({
                message : "Incorrect password"
            });
        }
        let Token = jwt.sign({
                id : findUser._id 
                },process.env.JWT_TOKEN,
                { expiresIn: "1d"}
            );
            res.cookie("token", Token ,{
                httpOnly : true, 
                secure   : true,
                maxAge   : 1000*60*60*24,
                sameSite: "none",
                path: "/"
            });
        res.json({
            message : "you are loggin",
        });
    } catch (error) {
        return res.json({
            message : "server error",
            error   : error
        });
    }
}

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.data?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Please login first",
      });
    }
    const findUser = await userRegisterModel
      .findById(userId)
      .select("-password -__v")
      .lean();

    if (!findUser) {
      return res.status(404).json({
        message: "User not found in database",
      });
    }
    const fetchAddress = await addressModel.find({
      user_id: userId,
      "address.isDelete": { $ne: true },
    }).lean();

    return res.status(200).json({
      message: "User logged in",
      user: {
        ...findUser,
        Address: fetchAddress,
      },
    });
  } catch (error) {
    console.error("getCurrentUser error:", error);

    return res.status(500).json({
      message: "Unable to fetch current user",
    });
  }
};
export const storeMultipleAddress = async (req, res) =>{
    try {
        let {address} = req.body;
        let {user_id} = req.params;
        let finduser_idInregisterModel = await userRegisterModel.findById(user_id);
        if(!finduser_idInregisterModel){
            return res.json({
                message : "user_id not found"
            });
        }
        let findUser_idInAddressModel  = await addressModel.findOne({
            user_id
        });
        if(!findUser_idInAddressModel){
            let addUser_id = await addressModel.create({
                user_id,
                address
            });
            return res.json({   
                message : "User_id added successfully"
            });
        }
        findUser_idInAddressModel.address.push(address);
        await findUser_idInAddressModel.save();
        res.json({   
            message : "address added",
        });
    } catch (error) {
        return res.json({
            message : "address not added yet ",
            error   : error
        }); 
    }
} 
export const DeleteAddress = async (req, res) => {
    try {
        const { user_id, address_id } = req.params;

        const updated = await addressModel.findOneAndUpdate(
            { user_id, "address._id": address_id },
            { $set: { "address.$.isDelete": true } }
        );

        if (!updated) {
            return res.status(404).json({ message: "address not found" });
        }

        return res.status(200).json({ message: "address deleted" });
    } catch (error) {
        return res.status(500).json({
            message: "address not deleted",
            error: error.message
        });
    }
};
export const DeleteUserAccount = async (req, res)=>{
    try {
        let{user_id} = req.params;
        let findUser = await userRegisterModel.findById(user_id);
        if(!findUser){
            return res.json({
                message : "user not found"
            });
        } 
        await userRegisterModel.findByIdAndDelete(user_id); 
        await addressModel.deleteOne({
            user_id
        });
        return res.status(200).json({
            message: "Account deleted successfully"
        });
    } catch (error) {
         return res.status(500).json({
            message: error.message
        });
    }
}
export const searchProducts = async (req, res)=>{
    try {
       let {name, brand} = req.body;
       let search = name || brand;
       let findProduct = await productModel.find({
        $or : [
            { name  : {$regex : `${search}`, $options : 'i'} },
            { brand : {$regex : `${search}`, $options : 'i'} }
        ]
       });
       if(!findProduct){
            res.json({
                message : " no product found"
            });
       }
       res.json({
         product : findProduct
       }); 
    } catch (error) {
        message : error.message
    }
}
