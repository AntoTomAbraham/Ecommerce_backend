const Product=require("../models/product");
const express=require('express')
const router=express.Router()
const { check , validationResult} = require('express-validator');

const {getproductById,createProduct,getProduct,photo,deleteProduct,updateProduct,getAllProduct,getAllUniqueCategories}= require("../controllers/product")
const {getUserById}= require("../controllers/user")
const {isAuthenticated,isSignedIn,isAdmin}= require("../controllers/auth")


//params
router.param("userId",getUserById);
router.param("productId",getproductById);

//all of actual routes
//create

router.post("/product/create/:userId", isSignedIn,isAuthenticated,isAdmin,createProduct)

//read

router.get("/product/:productId",getProduct)
router.get("/product/photo/:productId",photo)

//delete route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct)
//update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct)
//listing route
router.get("/products",getAllProduct)

router.get("/products/categories",getAllUniqueCategories)

module.exports =router;



