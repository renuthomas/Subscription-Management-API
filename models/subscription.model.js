import mongoose from "mongoose";

const SubScheme=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Subscription name is required'],
        trim:true,
        minLength:2,
        maxlength:100,
    },
    price:{
        type:Number,
        required:[true,'Subscription price is required'],
        min:[0,'Subscription price must be greater 0'],
    },
    currency:{
        type:String,
        enum:['USD','EUR','GBP','INR','AUD','CAD','SGD','JPY','CNY'],
        default:'USD',
    },
    frequency:{
        type:String,
        enum:['daily','weekly','monthly','yearly'],
        default:'monthly',
    },
    category:{
        type:String,
        enum:['sports','entertainment','news','education','health','lifestyle'],
        required:[true,'Subscription category is required'],
    }, 
    paymentMethod:{
        type:String,
        required:[true,'Subscription payment method is required'],
        trim:true,
    }, 
    status:{
        type:String,
        enum:['active','cancelled','expired'],
        default:'active',
    },
    startDate:{
        type:Date,
        required:[true,'Subscription start date is required'],
        validate:{
            validator:(value)=>value<=new Date(),
            message:"Subscription start date must be in the past",
        }
    },
    renewalDate:{
        type:Date,
        validate:{
            validator:function(value){
                return value>=this.startDate
            },
            message:"Renewal date must be after the start date",
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'Subscription user is required'],
        index:true,
    },
},{timestamps:true});

//Auto-calculate the renewal date
SubScheme.pre('save',function(next){
    if(!this.renewalDate){
        const renewalperiods={
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365,
        }
        this.renewalDate=new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate()+renewalperiods[this.frequency]);
    }

    //Auto-update the status if renewal date has passed
    if(this.renewalDate<new Date()){
        this.status='expired';
    }
    next();

})

const Subscription=mongoose.model('Subscription',SubScheme);

export default Subscription;