//USED FOR AUTHENTICATION RELATEDL LIKE SIGN UP SIGN IN ......... 
var express = require('express')
var router = express.Router()
const { check , validationResult} = require('express-validator');
const {signup,signin,signout, isSignedIn} =require("../controllers/auth")

router.post("/signup",[
    check("name","name should be atleast 3 characters").isLength({min:3}),
    check("email","email is required").isEmail({min:3}),
    check("password","Password should be at least 3 character").isLength({min:3})
],signup)

router.post("/signin",[
    check("email","email is required").isEmail({min:3}),
    check("password","Password is required").isLength({min:3})
],signin)

router.get('/signout',signout)
router.get('/test',isSignedIn,(req,res)=>{
    res.json(req.auth)
})
module.exports=router;
