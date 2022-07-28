// const stripe =require("stripe")("your id here")
// const { result } = require("lodash");
// const uuid =require("uuid/v4")
// //makin payment we are receiving products and token from the frontend
// exports.makepayment=(req,res)=>{
//     const {products,token} =req.body   
//     console.log(products ,"PRODUCTS");
//     let amount=0;
//     products.map(p=>{
//         amount=amount+p.price;
//     })
//     const idempontencyKey=uuid()
//     //creating the customers and further creating the charges using the input details
//     return stripe.customers.create({
//         email:token.email,
//         source:token.id
//     }).then(customer=>{
//         stripe.charges.create({
//             amount:amount*100,
//             currrency:"USD",
//             customer:customer.id,
//             receipt_email:token.email,
//             description:"a test account",
//             shipping:{
//                 name:token.card.name,
//                 address:{
//                     line1:token.card.address_line1,
//                     line2:token.card.address_line2,
//                     city:token.card.address_city,
//                     country:token.card.address_country,
//                     postal_code:token.card.address_zip,
//                 }
//             }
//         },{idempontencyKey})
//         .then(result=>res.status(200).json(result))
//         .catch(err => console.log(err));
//     })
// }