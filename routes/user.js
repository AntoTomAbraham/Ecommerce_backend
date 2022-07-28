//THIS CONTAINS FUNCTION RELATED TO USER LIKE GETTING HIS FULL DETAILS AND CHANGING HIS NAME DETAILS ...

const express =require("express")
const router=express.Router()

const { getUserById, getUser ,updateUser,userPurchaseList}=require("../controllers/user")
const { isAuthenticated,isSignedIn, getallusers }=require("../controllers/auth")

//whenever there is a params in a route it will check for the "router.param" where the  inside route is same as the 
//inside route of the given route and it will do all the function that is in  that router.param and then go to main

//this param is used to find that particular user only
router.param("userId",getUserById)

router.get("/user/:userId",isSignedIn,isAuthenticated, getUser)
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser)


router.get("/orders/user/:userId",isSignedIn,isAuthenticated,userPurchaseList)


module.exports=router;


