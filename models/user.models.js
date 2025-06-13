import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'User name is required'],
            trim:true,
            minlength:[3,'User name must be at least 3 characters'],
            maxlength:[50,'User name must be at most 50 characters'],
        },
        email:{
            type:String,
            required:[true,'User email is required'],
            unique:true,
            trim:true,
            match:[/\S+@\S+\.\S+/,'Please enter a valid email address'],
        },
        password:{
            type:String,
            required:[true,'User password is required'],
            minlength:[6,'User password must be at least 6 characters'],
        },
    },
    {
        timestamps:true
    }
)

const User = mongoose.model('User',userSchema);
export default User;