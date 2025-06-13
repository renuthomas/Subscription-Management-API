import { Router } from "express";  
import { getUsers,getUser,createUser,updateUser,deleteUser } from "../controllers/user.controller.js"; 
import authorize from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/",getUsers);

userRouter.get("/:id",authorize,getUser);

userRouter.post("/",authorize,createUser)

userRouter.put("/",authorize,updateUser)

userRouter.delete("/",authorize,deleteUser)

export default userRouter;


