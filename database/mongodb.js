import mongoose from "mongoose";
import { DB_URI,NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new Error("Please define the DB_URI environment variable inside .env.<development/production>.local");
}

const connecttoDB = async () => { 
    try{
        await mongoose.connect(DB_URI);
        console.log(`MongoDB connected successfully in ${NODE_ENV || "development"} mode`);  

    }catch(err){
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }  
}

export default connecttoDB;