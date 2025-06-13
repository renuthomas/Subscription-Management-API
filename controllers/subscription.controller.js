import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription=async(req,res,next)=>{
    try{
        const subscription=await Subscription.create({
            ...req.body,
            user:req.user._id
        })
        console.log("Subscription created:", subscription._id);

        await workflowClient.trigger({
            url:`${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body:{
                subscriptionId:subscription._id,
            },
            headers:{
                'Content-Type': 'application/json'
            },
            retries:0,
        })

        res.status(201).json({
            success:true,
            message:"Subscription created successfully",
            data:subscription
        })
    }catch(error){
        next(error);
    }
}

export const getAllUserSubscriptions=async(req,res,next)=>{
    try{
        if(req.user._id.toString()!==req.params.id){
            const error=new Error("You are not authorized to view this resource");
            error.statusCode=403;
            throw error;
        }

        const subscriptions=await Subscription.find({user:req.params.id}).populate('user','name email')
        res.status(200).json({
            success:true,
            message:"Subscriptions retrieved successfully",
            data:subscriptions
        })
    }catch(error){
        next(error);
    }
}

export const getAllSubscription=async(req,res,next)=>{
    try{
        const subscriptions=await Subscription.find({});
        res.status(200).json({
            success:true,
            message:"Subscriptions retrieved successfully",
            data:subscriptions
        })
    }catch(error){
        next(error)
    }
}

export const getSubscriptionDetails=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const subdetails=await Subscription.find({_id:id,user:req.user._id})
        if(subdetails){
            res.status(200).json({
            success:true,
            message:"Subscriptions details retrieved successfully",
            data:subdetails
            })
        }else{
            res.status(404).json({success:false,message:"Subscription not found"})
        }
    }catch(error){
        next(error)
    }
}

export const updateSubscription=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const subscription=await Subscription.find({_id:id,user:req.user._id});
        if(subscription){
            const data=req.body
            const result=await Subscription.updateOne({_id:id},{...data})
            if(result.acknowledged){
                res.status(200).json({success:true,message:"Subscriptions details updated successfully"})
            }else{
                res.status(404).json({success:false,data:"Subscription details not updated"})
            }
        }else{
            res.status(404).json({success:false,data:"Subscription is not available"})
        }

    }catch(error){
        next(error)
    }
}

export const deleteSubscription=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const subscription=await Subscription.find({_id:id,user:req.user._id});
        if(subscription){
            const deleted=await Subscription.deleteOne({_id:id})
            if(deleted.deletedCount){
                res.status(200).json({success:true,message:"Subscriptions details deleted successfully"})
            }else{
                res.status(404).json({success:false,data:"Subscription details not deleted"})
            }
        }else{
            res.status(404).json({success:false,data:"Subscription Not Found"})
        } 
    }catch(error){
        next(error)
    }
}

export const cancelSubscription=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const subscription=await Subscription.find({_id:id,user:req.user._id});
        if(subscription){
            const result=await Subscription.updateOne({_id:id},{status:"cancelled"})
            if(result.acknowledged){
                res.status(200).json({success:true,message:"Subscriptions cancelled successfully"})
            }else{
                res.status(404).json({success:false,data:"Subscription not cancelled"})
            }
        }else{
            res.status(404).json({success:false,data:"Subscription Not Found"})
        }
    }catch(error){
        next(error)
    }
}

export const renewalSubscription=async(req,res,next)=>{
    try{
        console.log("User details:",req.user)
        const arr=await Subscription.find({renewalDate:{$gte:new Date()},user:req.user._id})
        if(arr){
            res.status(200).json({success:true,message:"Upcoming subscriptions retrieved successfully",data:arr})
        }else{
            res.status(404).json({success:false,data:"No upcoming renewals were found"})
        }
    }catch(error){
        next(error)
    } 
}
