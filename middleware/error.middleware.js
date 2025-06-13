const errorMiddleware=(err, req, res, next)=>{
    try{
        console.log("Err:",err)
        let error={...err};
        console.log("Error:",error);
        error.message=err.message;
        console.error(err);

        //Mongoose bad ObjectId
        if(err.name==="CastError"){
            const message=`Resource not found. Invalid: ${err.path}`;
            error=new Error(message);
            error.status=404;
        }

        ///Mongoose duplicate key
        if(err.code===11000){
            const message=`Duplicate field value entered: ${err.keyValue.name}`;
            error=new Error(message);
            error.status=400;
        }

        //Mongoose validation error
        if(err.name==="ValidationError"){
            const message=Object.values(err.errors).map((val)=>val.message);
            console.log("Message:",message);
            error=new Error(message.join(","));
            error.status=400;
        }
        res.status(error.status || 500).json({
            success:false,
            error:error.message || "Server Error",
        });

    }catch(error){
        next(error);
    }
}

export default errorMiddleware;