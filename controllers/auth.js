const User=require("../models/user")
const { check , validationResult} = require('express-validator');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

exports.signout=((req,res)=>{
    res.clearCookie("token")
    res.json({message:"user signout successfully"});
})


exports.signup= (req,res) => {
    //validationresult is using to check the checker we give in the route
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    //in the req we will get the signup details and we will make a object of it in the User(model) and we save it 
    //using the second below line
    const user=new User(req.body)
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err:"NOT able to save user in DB"
            })
        }
        res.json({
            name:user.name,
            email:user.email,
            id:user._id
        })
    })
}

exports.signin=(req,res)=>{
    const errors=validationResult(req);
    const {email,password} = req.body;

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].param
        });
    }
    //every document will be having a identical email
    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({
            error:"USER email doesnot exist"
        })
        }
        console.log(user)
        //WILL FIND THE PARTICULAR USER AND CHECK AUTHENTICATION HERE THE INFORMATION OF THAT PARTICULAR USER IS TAKEN
        //THAT IS "USER.AUTHENTICATION" THAT ONLY THAT PARTICULAR USER
        //authenticate CAN BE USED HERE SINCE WE HAVE EXPORTED FROM THERE 
        if(!user.authenticate(password)){
            res.status(401).json({
                error:"Email and Password donot match"
            })
        }

        //While doing signin we will make a token of it(1st line),and we will store it in the cookies(2nd line)
        //and in the third line we will make a model of itand send it as json
        //we will send  "token",_id,name,email,role

        //CREATE TOKEN|||
        const token=jwt.sign({ _id : user._id},process.env.SECRET)
        //PUT TOKEN INTO COOKIE
        res.cookie("token",token,{ expire : new Date() + 9999 })
        //send response to front end
        //HERE we only need to send the _id ,name,email,role for this we are using the below one
        const {_id,name,email,role}=user;
        //we are sending the response in the below way to get like 2 objects one major object and sub object 
        //if we dont make the 2nd object(2nd flower object) its not a probelm we can print  it together
        //or else send here just user we will get the full user
        
        return res.json({token, user:{_id,name,email,role}})
    })    
}
//

//Protected Route

//a token is  made when we sign in here we are checking both the tokens are same or not
//for this we are not using expressjwt for it
//it is a inbuilt function for token checking

exports.isSignedIn=expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth",
})

//custom Middlewares

//req.profile will be sent from front end it is the id which we get from the params

exports.isAuthenticated=(req,res,next)=>{
    let checker=req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error:"ACCESS DENIED"
        })
    }
    next();    
}

exports.isAdmin=(req,res,next)=>{
    if(req.profile.role === 0){
        res.status(403).json({
            error:"You are not Admin"
        })
    }
    next();    
}




//Middleware