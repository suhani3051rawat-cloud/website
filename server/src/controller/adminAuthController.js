import {AdminPannelModel} from "../model/adminModel.js"
import { productModel } from "../model/productModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { categoryModel } from "../model/productCategoryModel.js";
import { userRegisterModel } from "../model/userRegisterModel.js";
import { uploadImage } from "../service/service.js";
import { v4 as uuid } from "uuid";

export const adminRegister = async (req, res)=>{
    try {
        let findAdmin     = await AdminPannelModel.findOne({
           email : process.env.ADMIN_EMAIL
        });
        if(findAdmin){
            return res.status(409).json({
                message: "Admin already exists"
            });
        }
        let HashPassword  = await bcrypt.hash(process.env.ADMIN_PASSWORD , 10); 
        let adminRegister = await AdminPannelModel.create({
            name        : process.env.ADMIN_NAME,
            phone_Number: process.env.ADMIN_PHONE_NUMBER,
            email       : process.env.ADMIN_EMAIL,
            password    : HashPassword 
        });
        return res.json({
            message : "Admin register"
        });   
    }
    catch (error) {
        console.log(error);
        return res.json({
            message : "Admin not registered yet"
        });
    }
}
export const adminLogin = async (req, res)=>{
    try {
        let{email, password} = req.body;
        let adminLogin = await AdminPannelModel.findOne({
            email
        });
        if(!adminLogin){
            return res.json({
                message : "Admin not found"
            });
        }  
        let passwordCheck = await bcrypt.compare(
                password,
                adminLogin.password
        );
        if(!passwordCheck){
            return res.json({
                message : "Incorrect password"
            });
        }
        let Token = jwt.sign({
                    id : adminLogin._id 
                },process.env.JWT_TOKEN,
                { expiresIn: "1d"}
                );
                res.cookie("token", Token ,{
                    httpOnly : true, 
                    secure   : false,
                    maxAge   : 1000*60*60*24,
                });
        return res.json({
            message : "Admin is logged in",
        });
    } 
    catch(error){
       return res.json({
            message : "error",
            error   :  error
       });
    }
}
export const adminLogOut = async (req,res)=>{
    try {
        await res.clearCookie("token",{
        httpOnly : true,
        secure   : false,
       }); 
       res.json({
        message : " Admin logout"
       }); 
    } catch (error) {
       return res.json({
        message : "Admin is not logged in",
        error   : error
       }); 
    }
}
export const getCurrentAdmin = async (req,res) =>{
    try {
       let findAdmin = await AdminPannelModel.findById(req.data.id);
        if(!findAdmin){
            return res.json({
                message :"Admin not found in dataBase"
            });
        }  
        res.json({
            message : "Admin logged in",
            findAdmin
        }); 
    } 
    catch (error) {
       return res.json({
          message : error.message
       }); 
    }  
}
export const block_unBlock_user = async (req, res)=>{
    try {
        let {user_id} = req.params;
        let findUser  = await userRegisterModel.findOne({
            _id : user_id
        });
        if(!findUser){
            return res.json({
                message : "User not found"
            });
        } 
        if (findUser.status == 1) {
            findUser.status = 0;
            await findUser.save();

            return res.json({
                message: "User unblocked successfully"
            });

        } else {
            findUser.status = 1;
            await findUser.save();

            return res.json({
                message: "User blocked successfully"
            });
        }
    } catch (error) {
        console.log(error);
         return res.json({
            message : error.message
         }); 
    }
}
export const addProducts = async (req, res)=>{
    try {
        const id = uuid();
        let {category_id} = req.params;
        let upload        = await uploadImage(req.file.buffer ,id);
        let {name, description, price, brand, image, stock} = req.body;
        let addProduct = await productModel.create({
            name,
            description,
            price,
            category_id,
            brand,
            image :[upload],
            stock
        });
        let findCategory = await categoryModel.findByIdAndUpdate(
             category_id  , 
             {$inc : {
                totalProduct :  1
             }}
        ); 
        res.status(200).json({
            message : 'product added successfully' , 
        });  
    } catch (error) {
       res.json({
            message : error.message
       }); 
    }
}
export const addcategory = async (req, res)=>{
    try {
        let {category} = req.body; 
        let findCategory = await categoryModel.findOne({
            category
        });
        if(findCategory){
            return res.json({
                message : "Category already exist"
            });
        }
        let createCategory = await categoryModel.create({
            category
        });
        res.json({
            message : "Category added successfully"
        });
    } catch (error) {
        res.json({
            message : error.message
        });
    }
}
export const categoryList = async (req, res)=>{
    try {
        let findCategory = await categoryModel.find({}).select('-__v');
        res.json({
            message : "All categories",
            findCategory
        });
    } catch (error) {
        res.json({
            message : error.message
        });
    }
}
export const ListProducts = async (req, res)=>{
    try { 
        let {category}   = req.query;
        let findCategory = await categoryModel.findOne({
            category
        });
        if(!findCategory){
            return res.json({
                message :  "Catgory not found"
            });
        } 
        let fetchProductsFromProductModel = await productModel.find({
            category_id : findCategory._id
        }).select("-category_id -__v");
        res.json({
           message : "Data found",
           fetchProductsFromProductModel
        });
    } catch (error) {
        res.json({
            message : error.message
        });
    }
}
export const searchProducts = async (req, res)=>{
    try {
       let { search } = req.query;
       let findProduct   = await productModel.find({
            $or : [
                { name  : {$regex : `${search}`, $options : 'i'} },
                { brand : {$regex : `${search}`, $options : 'i'} }
            ]
        });
        if(findProduct.length === 0){
            res.json({
                message : " no product found"
            });
        }
        res.json({
            product : findProduct
        }); 
    } catch (error) {
        res.json({
            message : error.message
        })
    }
}
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
export const deleteProducts = async (req, res)=>{
    try {
       let{id} = req.params;
       let findProduct   = await productModel.findById(id);
       if(!findProduct){
            return res.json({
                message: "Product not found"
            });
       }
       let deleteProduct = await productModel.deleteOne({
            _id : id,            
       });
       await categoryModel.findByIdAndUpdate(
            findProduct.category_id, 
          { 
            $inc : {
                totalProduct : -1
            }
          }
       )
       res.json({
           message : "Product deleted successfully"
       });   
    } catch (error) {
        res.json({
            message : error.message
        });
    }
}