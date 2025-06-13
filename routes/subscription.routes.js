import { Router } from "express";
import { createSubscription,getAllUserSubscriptions,getAllSubscription,getSubscriptionDetails,updateSubscription,deleteSubscription,cancelSubscription,renewalSubscription}  from "../controllers/subscription.controller.js";
import authorize from "../middleware/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", getAllSubscription) 

subscriptionRouter.get("/upcoming-renewals",authorize,renewalSubscription)

subscriptionRouter.get("/:id",authorize,getSubscriptionDetails) 

subscriptionRouter.post("/",authorize, createSubscription) 

subscriptionRouter.put("/:id",authorize,updateSubscription) 

subscriptionRouter.delete("/:id",authorize,deleteSubscription) 

subscriptionRouter.get("/user/:id",authorize,getAllUserSubscriptions) 

subscriptionRouter.put("/cancel/:id/",authorize,cancelSubscription)








export default subscriptionRouter;