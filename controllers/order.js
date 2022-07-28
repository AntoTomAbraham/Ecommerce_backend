const order = require("../models/order")
const {Order,ProductCart} =require("../models/order")

exports.getOrderById = (req,res,next,id)=>{
    Order.findById(id)
    //the below line is to get name and price from product in products which  is in order 
    .populate("products.product","name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No oder found in DB"
            })
        }
        req.order =order
        next();
    })
}
//her in the below code we make a new order 
//we will get the user id and we will save it in the database
//so the
exports.createOrder =(req,res) =>{
    //req.profile is what we get using the middleware ie the userid(user details) we are saving it(user details)
    //we are giving req.profile value to req.body.order.user
    //to the in 3rd and 2nd line
    //req.body.order is the body that we are getting
    req.body.order.user =req.profile
    const order =new Order(req.body.order)
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"failed to save your order in db"
            })
        }
        req.order =order
        next();
    })
}


exports.getAllOrder =(req,res)=>{
    Order.find()
    //its taking users id and name
    .populate("user","_id name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No order in db"
            })
        }
        res.json(order)
    })
}

exports.getOrderStatus =(req,res) =>{
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus =(req,res) =>{
    Order.update(
        {_id:req.body.orderId},
        {$set:{status: req.body.status}},
        (err,order) =>{
            if(err){
                return res.status(400).json({
                    error:"cant update status"
                })
            }
            res.json(order)
        }
    )
}
