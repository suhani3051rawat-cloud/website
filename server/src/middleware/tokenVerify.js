import jwt from 'jsonwebtoken';

export const verifyToken = async (req,res,next) =>{
  try {
    let token = req.cookies.refreshToken;
    if(!token){
       return res.json({
            message : "Token not found"
        });
    }
    jwt.verify(token, process.env.REFRESH_TOKEN,(error, data)=>{
        if(error){
            console.log(error)
            return res.json({
                message : error.message
            });
        }
        req.data = data;
        next()
    })
  } 
  catch (error) {
        return res.json({
            message : "Something went wrong",
            error   : error
        });
  }
}