const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const crypto=require("crypto")
const uuidv1=require('uuid/v1')

var userSchema=new Schema({
   name:{
       type:String,
       required:true,
       maxlength:32,
       trim:true,
   },
   lastname:{
       type:String,
       required:false,
       maxlength:32,
       trim:true,
   },
   email:{
       type:String,
       trim:true,
       required:true,
       unique:true
   },
   userinfo:{
       type:String,
       trim:true
   },
   //password
   encry_password:{
       type:String,
       required:true
   },
   salt:String,
   role:{
       type:Number,
       default:0,
   },
   purchases:{
       type:Array,
       default:[]   
   }
},{timestamps:true})


//in the below lines password is what we are getting in the post request
userSchema.virtual("password")
   .set(function(password){
       this._password=password
       this.salt=uuidv1()
       this.encry_password=this.securePassword(password);
   })
   .get(function(){
       return this._password
   })



userSchema.methods={
 //here we take a plain password and then make securepassword of it and check whether is it equal to encry_password
 //HOW IT CHECK IS THAT FIRST OF ALL IT WILL FIND DOCUMENT OF THE PARTICULAR EMAIL (auth there is)  
 //AND CHECK WHETHER THE PARTICULAR PLAIN PASSWORD AND THE PASSWORD GETTING THROUGH EMAI(FIND COMMAND) IS SAME
    authenticate:function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password
    },
//HERE we would make a securepassword using salt crypto ........
    //the below code we get it from unofficial crypto documentation
    securePassword:function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto.createHmac('sha256', this.salt)  
            .update(plainpassword)  
            .digest('hex'); 
        }
        catch(err){
            return ""
        }
    }
}


module.exports=mongoose.model("User",userSchema)