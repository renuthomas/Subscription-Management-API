import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const authorize=async(req,res,next) => {
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token=req.headers.authorization.split(" ")[1];
        }
        console.log("Token:",token);

        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        const decoded=jwt.verify(token,JWT_SECRET);
        console.log("Decoded:",decoded);
        const user=await User.findById(decoded.id).select("-password");
        console.log("User:",user);
        if(!user){
            return res.status(401).json({message:"Unauthorized"});
        }
        req.user=user;
        next();
    }catch(error){
      res.status(401).json({message:"Unauthorized",error:error.message});  
    }  
}

export default authorize;