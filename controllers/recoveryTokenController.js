const RecoveryToken = require('../models/RecoveryToken')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const randomstring = require("randomstring");
const sendEmail = require('../utils/verify')
const bcrypt = require('bcrypt')


const createRecoverToken = asyncHandler(async(req,res)=>{
 
  const {method,value} = req.body
  


  if(!method || !value){
     return res.status(400).json({message:'recovery option is undefined'})
  }


  const foundUser = await User.findOne(method === 'email' ? {email:value}: method === 'number' && {phoneNumber:value}).select('-password').exec()

  if(!foundUser){
    return res.status(400).json({message:'no user is found'})
  }

  
  const foundToken = await RecoveryToken.findOne({user:foundUser._id})
  const randomToken = randomstring.generate(6)




let createdToken;

  if(!foundToken){
     createdToken = await RecoveryToken.create({user:foundUser._id,token:randomToken})

     if(!createdToken){
      return res.status(400).json({message:'invalid recovery options received'})
     }

     console.log(createdToken)
  }
  else{
    foundToken.createdAt = Date.now()
    foundToken.token = randomToken
    await foundToken.save()
  }
  



  
  if(method === 'email'){
    await sendEmail(foundUser.email,"verification code",foundToken ? foundToken?.token : createdToken?.token)
  }else if(method === 'number'){
     // phone number 
  }
  else {
    return res.status(400).json({message:'invalid recovery method or value'})
  }

  res.json(foundUser)

  

})



const getUserbyRecovery = asyncHandler(async(req,res)=> {

  const {username,hash} = req.query

  

 
  if(!username || !hash){
    return res.status(400).json({message:'400'})
  }
  
  const foundUserToken = await RecoveryToken.findOne({user:hash}).exec()


  if(!foundUserToken){
     return res.status(404).json({message:'user is not verifying'})
  }

  

  res.json(foundUserToken?.user)


})


const  compareRecoveryToken = asyncHandler(async(req,res) => {

 const {resetCode,userId} = req.body
 
  if(!resetCode || !userId){
    return res.status(400).json({message:'please enter a code'})
  }


  const foundToken = await RecoveryToken.findOne({token:resetCode,user:userId})


  if(!foundToken){
    return res.status(404).json({message:'invalid code'})
  }
  
  //delete foundToken when exist

  res.json({message:'token is correct'})

})



const changePasswordByToken = asyncHandler(async(req,res) => {
  
  const {resetCode,userId,newPassword,confirmNewPassword} = req.body


  if(!resetCode || !userId){ 
   return res.status(400).json({message:"400"})
  }

  if(!newPassword || !confirmNewPassword){
     return res.status(400).json({message:'all fields are required'})
  }

  const foundToken = await RecoveryToken.findOne({token:resetCode,user:userId})
  

  if(!foundToken){
    return res.status(404).json({message:'invalid code'})
  }

  const foundUser = await User.findById({_id:foundToken.user}).exec()


  if(!foundUser){
     return res.status(404).json({message:'user is not found'})
  }




  const hashedNewPassword = await bcrypt.hash(newPassword,10)

  
  foundUser.password = hashedNewPassword

  await foundUser.save()
  await foundToken.deleteOne()

  res.json({message:'password has changed successfully'})

})





module.exports = {createRecoverToken,getUserbyRecovery,compareRecoveryToken,changePasswordByToken}