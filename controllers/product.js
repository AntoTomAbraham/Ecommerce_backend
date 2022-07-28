const Product =require("../models/product");
const formidable=require("formidable")
const _ =require("lodash")
const fs=require("fs")
const { check , validationResult} = require('express-validator');
const { RSA_NO_PADDING } = require("constants");
const { sortBy } = require("lodash");
//const product = require("../models/product");

exports.getproductById = (req,res,next,id) =>{
    Product.findById(id)
    .populate("category")
    .exec((err,pro)=>{
        if(err){
            return res.status.json({
                error:"product not found in DB"
            })
        }
        //saving pro to req.pro
        req.product=pro;
        next();
    })
}

exports.createProduct =(req,res)=>{
    //formidable is used to handle images file etx
    //for this we use the form like given below 
    let form =new formidable.IncomingForm()   
     //keep extension means that keep particular images extension like png,jpeg
    form.keepExtensions =true;
    //The req below is the req comming to createProduct
    //we  are parsing it
    //(err,fields,file) are callback functions  
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }

        const {name,description,price,category,stock,} =fields;

        if(
            !name || !description || !price || !category || !stock
        ){
            return res.status(400).json({
                error:"please include this field"
            })
        }

        //restriction on field
        //if there is no error
        //here fields is the input values which contain name,description ..........
        //we are making that product(fields) into product 
        let product= new Product(fields)
        //handiling file
        if(file.photo){
            //3000000 means 3mb
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File status too big!"
                })
            }
            //photo is a field in product and data and contenttype is another field inside photo
            //readfilesync read the file and return the data
            //so here it is reading the file in that particular location 
            product.photo.data =fs.readFileSync(file.photo.path)
            product.photo.contentType=file.photo.type
        }
        //console.log(product)
        //save to db
        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error:"saving Tshirt in DB failed"
                })
            }
            res.json(product)
        })
    });
}

//for getting the product we have already made a route to get the content using get productbyId first,
// it returns req.product so to get product we are using req.product here
exports.getProduct = (req,res) =>{
    req.product.photo =undefined
    return res.json(req.product)
}
//photo is sended seperately use the below method
exports.photo =(req,res,next) =>{
    if(req.product.photo.data){
        //we need to set content type
        res.set("content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
} 


//delete controllers

exports.deleteProduct =(req,res)=>{
    let product =req.product;
  if(!product) return res.json({message: "no product found"})
    product.remove((err,deletedProduct)=>{
        console.log(deletedProduct);
        if(err){ 
            return res.status(400).json({
            error:"Failed to delete the product"
        });
    }
       res.json({
        message:"Deletion was a success",
        deletedProduct
    })
})
}

//update product
exports.updateProduct =(req,res)=>{
    //formidable is used to handle images file etx
    //for this we use the form like given below 
    let form =new formidable.IncomingForm()   
     //keep extension means that keep particular images extension like png,jpeg
    form.keepExtensions =true;
    //The req below is the req comming to createProduct
    //we  are parsing it
    //(err,fields,file) are callback functions  
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }

        let product=req.product
        //_.extend is method it takes th object ,extend and update it
        //fields is the input values
        product=_.extend(product,fields)
        //handiling file
        if(file.photo){
            //3000000 means 3mb
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File status too big!"
                })
            }
            //photo is a field in product and data and contenttype is another field inside photo
            //readfilesync read the file and return the data
            //so here it is reading the file in that particular location 
            product.photo.data =fs.readFileSync(file.photo.path)
            product.photo.contentType=file.photo.type
        }
        //console.log(product)
        //save to db
        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error:"updation failed"
                })
            }
            res.json(product)
        })
    });
}

exports.getAllProduct = (req,res)=>{
    let limit=req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy=req.query.sortBy ? req.query.sortBy  :"_id"
    Product.find()
    //the below line means we dont need photo
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error:"No product Found"
            })
        }
        res.json(products)
    })
}


exports.getAllUniqueCategories =(req,res) =>{
    Product.distinct("category",{} ,(err,category)=>{
        if(err){
            return res.status(400).json({
                error:"No Category Found"
            })
        }
        res.json(category)
    })
}


exports.updateStock = (req,res,next) =>{
    let myOperation =req.body.order.products.map(prod =>{
        return {
            updateOne :{
                filter :{ _id:prod._id},
                update : {$inc : {stock: -prod.count,sold: +prod.count}}
            }
        }
    } )
    Product.bulkWrite(myOperation,{},(err,products) =>{
        if(err){
            return res.status(400).json({
                error:"Bulk operation Failed"
            })
        }
        next()
    })
    
}







