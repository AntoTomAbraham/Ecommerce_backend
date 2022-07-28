const mongoose=require('mongoose');
const product = require('./product');
const {ObjectId}=mongoose.Schema

const productCartSchema= new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:product
    },
    name:String,
    count:Number,
    price:Number,
});


const ProductCart =mongoose.model("ProductCart", productCartSchema)


const OrderSchema= new mongoose.Schema({
    products:[productCartSchema],
    transaction_id:{},
    amount:{type:Number},
    address:String,
    status:{
        type:String,
        default:"Received",
        enum:["Cancelled","Delivered","shipped","Processing","Recieved"]
    },
    updated:Date,
    user:{
        type:ObjectId,
        ref:"User"
    }
},{timestamps:true}
);

const Order=mongoose.model("Order",OrderSchema)


module.exports={Order,ProductCart};