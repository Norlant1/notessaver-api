const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const User = require('../models/User')
const Joi = require('joi')
const Token = require('../models/token')
const sendEmail = require('../utils/verify')
const randomstring = require("randomstring");
const SetOfNotes = require('../models/SetOfNotes');


// @desc Get all users
// @route GET /users
// @access Private


const getUserByEmail =  asyncHandler(async(req,res) => {
  
  const {email} = req.body

   
  if(!email){
     return res.status(400).json({message:'email is empty'})
  }



  const foundUser = await User.findOne({email}).collation({locale:'en',strength:2}).select('-password').exec()

  if(!foundUser) {
     return res.status(404).json({message:'email does not exist'})
  }


  res.json(foundUser)

})


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

  const createdSOT = await SetOfNotes.create({user:user._id,title:'default '})

  user.activeSetofNotes = createdSOT._id

  await user.save()

   if(!user){
    return res.status(400).json({message:'bad request'})
   }
  // create a token for verification

  const randomToken = randomstring.generate()

  const token = await Token.create({
    userId: user._id,
    token: randomToken
  })


  

   
  const url = `${process.env.BASE_URL}activate/verify/${user._id}/verifyaccount/${token.token}`
  await sendEmail(user.email,"Verify Email",url)
  


  if(user){
   return res.status(201).json({message:`An Email sent to your account please verify`})
  }else {
    return  res.status(400).json({message:'invalid user data received'})
  }



})


const updateUser = asyncHandler(async(req,res) => {
 
  const {user,id} = req
  const {SetOfNotesId,active} = req.body



  if(!user || !id){
    return res.status(400).json({message:'username and id is required'})
  }

  
  const foundUser = await User.findOne({username:user,_id:id}).exec()
  
  
  if(!foundUser){
    return res.status(404).json({message:'user not found'})
  }

  if(SetOfNotesId) foundUser.activeSetofNotes = SetOfNotesId

  


    await foundUser.save()
  
  

  
  res.json(foundUser)
})


const deleteAllUsers = asyncHandler(async(req,res)=> {
  
  const items = await User.deleteMany({}).exec()

  if(!items){
    return res.status(400).json({message:'fail to delete'})
  }

  res.json({message:'successfully deleted'})
})


module.exports = {getUserByEmail,getAllUsers,createNewUser,updateUser,deleteAllUsers}

