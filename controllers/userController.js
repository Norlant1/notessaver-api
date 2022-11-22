const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const User = require('../models/User')
const Joi = require('joi')
const Token = require('../models/token')
const sendEmail = require('../utils/verify')
import { nanoid } from 'nanoid';

// @desc Get all users
// @route GET /users
// @access Private





const getAllUsers = asyncHandler(async(req,res) => {
  
  const users = await User.find().select('-password').lean() // lean would only send necessary datas
 
  if(!users.length){
   return res.status(400).json({message:'no user is found'})
  }

  res.json(users)

})


const createNewUser = asyncHandler(async(req,res) => {
  const {username,email,password,confirmPassword} = req.body;
  
  if(!username || !password || !email || !confirmPassword){
    return res.status(400).json({message:'all fields are required'})
   }
 

  const schema = Joi.object({
    username: Joi.string()
              .alphanum()
              .min(3)
              .max(30)
              .required(),
    
    email: Joi.string()
           .pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))         
           .required(),

    password: Joi.string()
    .min(7)
    .max(20)
    .required(),
  
    confirmPassword: Joi.ref('password')
     
   })

   
   const {error} = schema.validate({username,email,password,confirmPassword})

  console.log(username)
  console.log(email)


   if(error){
     return res.status(400).send(error.details[0].message)
   }

 
  const duplicateUsername = await User.findOne({username}).collation({locale:'en',strength:2}).lean().exec()
  const duplicateEmail = await User.findOne({email}).collation({locale:'en',strength:2}).lean().exec()
  

  if(duplicateUsername){
   return res.status(409).json({message:'The username already exist'})
  }
  if(duplicateEmail){
    return res.status(409).json({message:'The email already exist'})
  }

  const hashedPassword = await bcrypt.hash(password,10)

  const userObject = {username,email,"password":hashedPassword}

  const user = await User.create(userObject)

   if(!user){
    return res.status(400).json({message:'bad request'})
   }
  // create a token for verification

  const nanoToken = nanoid(64)
  const token = await Token.create({
    userId: user._id,
    token: nanoToken
  })

  const url = `${process.env.BASE_URL}activate/verify/${user._id}/verifyaccount/${token.token}`
  await sendEmail(user.email,"Verify Email",url)
  


  if(user){
   return res.status(201).json({message:`An Email sent to your account please verify`})
  }else {
    return  res.status(400).json({message:'invalid user data received'})
  }



})


const updateUser = asyncHandler(async() => {
   
})


const deleteAllUsers = asyncHandler(async(req,res)=> {
  
  const items = await User.deleteMany({}).exec()

  if(!items){
    return res.status(400).json({message:'fail to delete'})
  }

  res.json({message:'successfully deleted'})
})


module.exports = {getAllUsers,createNewUser,updateUser,deleteAllUsers}

