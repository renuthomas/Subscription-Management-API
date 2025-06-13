import User from "../models/user.models.js";

export const getUsers=async(req,res,next)=>{
    try{
        const users=await User.find().select("-password");
        res.status(200).json({
            success:true,
            message:"Users fetched successfully",
            data:users
        })
    }
    catch(error){
        next(error);
    }
}

export const getUser=async(req,res,next)=>{
    try{
        const user=await User.find({_id:req.params.id}).select("-password");
        console.log("User:",user);
        if(!user){
            const error=new Error("User not found");
            error.status=404;
            throw error;
        }
        res.status(200).json({
            success:true,
            message:"User fetched successfully",
            data:user
        })
    }
    catch(error){
        next(error);
    }
}

export const createUser=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body;

        if(!name || !email || !password){
            const error=new Error("Please provide all details");
            error.status=400;
            throw error;
        }
        
        const NewUser=await User.create({name,email,password});

        if(!NewUser){
            const error=new Error("User not created");
            error.status=500;
            throw error;
        }

        res.status(201).json({
            success:true,
            message:"User created successfully",
            data:NewUser
        })


    }catch(error){
        next(error);
    }
}

export const updateUser=async(req,res,next)=>{
    console.log(req.user)
    const {name,email,password}=req.body;

    try{
        if(!name && !email && !password){
            const error=new Error("Please provide at least one field to update");
            error.status=400;
            throw error;
        }

        const newname=name || req.user.name;
        const newemail=email || req.user.email;
        const newpassword=password || req.user.password;

        const updateUser=await User.findByIdAndUpdate(req.user._id,{
            name:newname,
            email:newemail,
            password:newpassword
        })

        if(!updateUser){
            const error=new Error("User not updated");
            error.status=500;
            throw error;
        }

        res.status(200).json({
            success:true,
            message:"User updated successfully",
            data:updateUser
        })

    }catch(error){
        next(error);
    }


}

export const deleteUser=async(req,res,next)=>{
    try{
        const user=await User.findByIdAndDelete(req.user._id);
        if(!user){
            const error=new Error("User not found");
            error.status=404;
            throw error;
        }
        res.status(200).json({
            success:true,
            message:"User deleted successfully",
            data:user
        })
    }catch(error){
        next(error);
    }
}
