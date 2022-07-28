const User=require("../models/user")
const Order=require("../models/order")


exports.getUserById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"No user found in DB"
            })
        }
        //just giving as req.profile
        req.profile = user
        next();
    })
}


exports.getUser = (req,res) =>{
    // undefined means they will not give out the following in the outputs (hiding)
    req.profile.salt= undefined;
    req.profile.encry_password=undefined;
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined;
    return res.json(req.profile)
}
//here we are already giving the userID so it will take all the information regarding the UserId from the Database
//and give it ""see the first function getuserbyid ""
//$set:req.body means it will rewrite the existing body with req.body that is comiing means if we want to rewrite 
//the name,we will give name as req,and it is automatically rewritted 
exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
    //$set:req.body means it will rewrite the existing body with req.body    
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err ){
                return res.status(400).json({
                    error:"You are not authorized"
                })
            }
            user.salt= undefined;
            user.encry_password=undefined;
            res.json(user)
        }
    )
}

//this is used to find which all user bought a particular thing, here first we will check the order list whether
//a particular _id is there and check that whether thae person with that id have bought that particular item 
exports.userPurchaseList=(req,res)=>{
    //only need to find user so weuse that 
    Order.find({user:req.profile._id})
    //we need to get  _id and name from user,user is a object but its an another model so to get we use like this 
    .populate("user","_id name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No order in this account"
            })
        }
        return res.json(order);
    })
}

//here we will be getting what all things we have bought and we will be adding this to a list(we make it) 
//and then we will 
//be adding this to the list that is already in user

exports.pushOrderInPurchaseList =(req,res,next)=>{
    let purchases = []
    req.body.order.products.forEach( product =>{
        purchases.push({
            _id:product._id
            ,name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order,
            transaction__id:req.body.order.transaction__id
        })
    })
    //store this in db
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push: {purchases:purchases}},
        //the below line is to send only the updated thing back
        {new: true},
        (err,purchases)=>{
            if(err){
                return res.status(400).json({
                    error:"unable to save purchase list"
                })
            }
            next() 
        }   
    )
}











