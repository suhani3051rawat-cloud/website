import { userRegisterModel } from "../model/userRegisterModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { addressModel } from "../model/storeUserMultipleAddress.js";
import { config } from "dotenv";
import { randomInt, createHash } from "crypto";
import { transporter } from "../../config/nodeMailer.js";
import otpModel from "../model/otpModel.js";

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
        let accessToken = jwt.sign({
            id : findUser._id,
         },
            process.env.ACCESS_TOKEN ,
            {
                expiresIn : "15m"
            }
        ) 
        let refreshToken = jwt.sign({
            id : findUser._id
        },
        process.env.REFRESH_TOKEN,
       {
        expiresIn : "7d"
        })
        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            message : "you are loggin",
            accessToken 
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
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
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
export const refreshToken = async (req, res)=>{
    try {
       let Token = req.cookies.refreshToken;
    if(!Token){
        return res.status(401).json({
            message : "refresh token not found"
        });
    }
    let decoded = jwt.verify(Token , process.env.REFRESH_TOKEN); 
    let accessToken = jwt.sign({
        id : decoded.id
    },
     process.env.ACCESS_TOKEN,
    {expiresIn : "15m"});

    let refreshToken = jwt.sign({
        id : decoded.id
    },
    process.env.REFRESH_TOKEN,
    {
        expiresIn : "7d"
    });
   res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
   });
    res.json({
        message : "token created successfully",
        accessToken
    });
    } catch (error) {
        res.json({
            message : error.message
        });
    }
}
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
                message: "User not found",
            });
        }
        const fetchAddress = await addressModel.find({
            user_id: userId
        }).lean();
        const activeAddresses = fetchAddress.map((item) => ({
            ...item,
            address: item.address.filter(
                (addr) => addr.isDelete !== true
            )
        }));

        console.log("Fetched Addresses:", activeAddresses);

        return res.status(200).json({
            message: "User fetched successfully",
            user: {
                ...findUser,
                Address: activeAddresses
            }
        });

    } catch (error) {
        console.error("getCurrentUser error:", error);

        return res.status(500).json({
            message: "Unable to fetch current user",
            error: error.message
        });
    }
};
const hashOTP = (otp) => {
    return createHash("sha256").update(otp).digest("hex");
};
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }
        const userEmail = email.trim().toLowerCase();

        const otp = randomInt(100000, 1000000).toString();

        const hashedOTP = hashOTP(otp);

        console.log("3. OTP generated");

        const mailResponse = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Your Email Verification OTP",
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
                <p>Do not share this OTP with anyone.</p>
            `
        });

        console.log("4. Email sent:", mailResponse.messageId);

        await otpModel.findOneAndUpdate(
            { email: userEmail },
            {
                otp: hashedOTP,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            },
            { upsert: true, new: true }
        );

        console.log("5. OTP saved in database");

        return res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log("OTP ERROR:", error);

        return res.status(500).json({
            message: "Unable to send OTP",
            error: error.message
        });
    }
};
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const userEmail = email.trim().toLowerCase();

        const savedOTP = await otpModel.findOne({
            email: userEmail
        });

        if (!savedOTP) {
            return res.status(400).json({
                message: "OTP not found. Please request a new OTP."
            });
        }

        if (savedOTP.expiresAt < new Date()) {
            await otpModel.deleteOne({ email: userEmail });

            return res.status(400).json({
                message: "OTP expired. Please request a new OTP."
            });
        }

        if (savedOTP.otp !== hashOTP(otp.toString())) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        await otpModel.deleteOne({ email: userEmail });

        return res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "OTP verification failed",
            error: error.message
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
