const express=require("express")
const router=express.Router()

const {updateCategory,getCategoryById,createCategory,getAllCategory,getCategory,removeCategory}= require("../controllers/category")
const {getUserById}= require("../controllers/user")
const {isAuthenticated,isSignedIn,isAdmin}= require("../controllers/auth")

//params
//this param is used to find that particular user only
router.param("userId",getUserById)
//this param is used to find that particular Category only
router.param("categoryId",getCategoryById)

//actual routes
router.post('/category/create/:userId',isSignedIn,isAuthenticated, isAdmin, createCategory)
router.get("/category/:categoryId", getCategory)
router.get("/categories", getAllCategory)

//updated
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated, isAdmin, updateCategory)

//delete
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated, isAdmin, removeCategory)

module.exports = router;