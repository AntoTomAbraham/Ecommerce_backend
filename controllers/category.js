const Category= require("../models/category")

//here the id passed is the category id and the final response will be category with that particular id 
exports.getCategoryById =(req,res,next,id)=>{
    Category.findById(id).exec((err,cate)=>{
        if(err){
            return res.status.json({
                error:"category not found in DB"
            })
        }
        //saving cate to req.category
        req.category=cate;
        next();
    })
}

exports.createCategory =(req,res) =>{
    console.log("CHECK BELOW FOR REQ.BODY")
    console.log(req.body)
    //saving the req.body to Category model and saving it as category
    const category=new Category(req.body)
    category.save((err,category)=>{
        if(err){
            console.log("ERROR RRRRRRRRRRRRRRRRRRRR")
            console.log(err);
            return res.status.json({
                error:"Not able to save Category in DB"
            })
        }
        res.json({category})
        console.log(category); 
    })
}

exports.getCategory =(req,res)=>{
    //here req.category is the category we returned in exports.getCategoryById  function
    //it will found out that particular IDs category using the middleware and here we are
    //returning that particular one
    return res.json(req.category)
}

exports.getAllCategory =(req,res) =>{
    Category.find().exec((err,categories)=>{
        if(err){
            return res.status.json({
                error:"No Categories found"
            })
        }
        res.json(categories)
    })
}

exports.updateCategory =(req,res) =>{
    //the below req.category is due to middleware
    const category=req.category;
    //req.body.name is the req from the client
    category.name =req.body.name;

    category.save((err,updateCategory)=>{
        if(err){
            return res.status.json({
                error:"Failed to update category"
            })
        }
        res.json(updateCategory)
    })
}

exports.removeCategory =(req,res) =>{
    const category =req.category;
    category.remove((err,category) => {
        if(err){
            return res.status.json({
                error:"Failed to delete this category"
            })
        }
        res.json({
            message: `${category.name  }successfully deleted`})
    })
}













