import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/user.models.js';
import { JWT_SECRET ,JWT_EXPIRES_IN} from '../config/env.js';

export const signup=async(req,res)=>{
    const session=await mongoose.startSession(); //Open a db session
    session.startTransaction();
    try{
        const {name,email,password}=req.body;

        if(!name || !email || !password){
            const error=new Error("Please provide all fields");
            error.statusCode=400;
            throw error;
        }

        const user=await User.findOne({email});

        if(user){
            const error=new Error("User already exists");
            error.statusCode=409;
            throw error;
        }
        
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=await User.create([{name,email,password:hashedPassword}],{session});

        const token=jwt.sign({id:newUser._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        await session.commitTransaction(); //Commit the transaction
        session.endSession();

        localStorage.setItem('JWT_TOKEN',token)

        return res.status(201).json(
            {
                success:true,
                message:"User created successfully",
                data:{
                    user:newUser
                }
            });

    }catch(err){
        await session.abortTransaction(); //At any time db fails ensure that session is aborted to ensure atomicity
        session.endSession();
        return res.status(500).json({error:err.message});
    }

}

export const signin=async(req,res)=>{
    const session=await mongoose.startSession(); //Open a db session
    session.startTransaction();
    try{
        const {email,password}=req.body;

        if(!email || !password){
            const error=new Error("Please provide all fields");
            error.statusCode=400;
            throw error;
        }

        const user=await User.findOne({email});

        if(!user){
            const error=new Error("User does not exist");
            error.statusCode=404;
            throw error;
        }
        
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            const error=new Error("Invalid credentials");
            error.statusCode=401;
            throw error;
        }

        const token=jwt.sign({id:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        await session.commitTransaction(); //Commit the transaction
        session.endSession();
        
        //localStorage.setItem('JWT_TOKEN',token) uncomment this to use localStorage in a browser environment

        return res.status(200).json(
            {
                success:true,
                message:"User logged in successfully",
                data:{
                    user,
                    token
                }
            });

    }catch(err){
        await session.abortTransaction(); //At any time db fails ensure that session is aborted to ensure atomicity
        session.endSession();
        return res.status(500).json({error:err.message});
    }

    
}

export const signout=async(req,res)=>{
    localStorage.removeItem('JWT_TOKEN');
    return res.status(200).json({
        success:true,
        message:"User logged out successfully"
    });   
}

