const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Token = require('../models/token')
const crypto = require('crypto')
const sendEmail = require('../utils/verify')


const login = asyncHandler(async(req,res) => {
  
  const {username,password} = req.body

  if(!username || !password){
   return res.status(400).json({message:'All fields are required'})
  }

  let foundUser = await User.findOne({username}).collation({locale:'en',strength:2}).exec()
  

  if(!foundUser){
    foundUser = await User.findOne({email:username}).collation({locale:'en',strength:2}).exec()

  }

 if(!foundUser){
   return res.status(401).json({message:'username is not found'})
 }

  console.log(foundUser)
 // check if the user is verified

 if(!foundUser.verified){
 
   let token = await Token.findOne({userId:foundUser._id})
 


   if(!token){

 
      const token = await Token.create({
        userId: foundUser._id,
        token: crypto.randomBytes(32).toString("hex")
      })
      
      console.log('test')
      console.log(`token ${token}`)
    
      const url = `${process.env.BASE_URL}activate/verify/${foundUser._id}/verifyaccount/${token.token}`
      await sendEmail(foundUser.email,"Verify Email",url)
  
   }


   return res.status(400).send({message:'An Email sent to your account please verify'})
 }









  const match = await bcrypt.compare(password,foundUser.password)

  if(!match){
 return res.status(401).json({message:'invalid password'})
  } 

  const accessToken = jwt.sign(
    {
      "userInfo":{
        "username": foundUser.username,
        "id": foundUser._id
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:'900sec'}
  )
    
 const refreshToken = jwt.sign(
  {
    "username":foundUser.username
  },
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn:'30d'}
 )

 res.cookie('jwt',refreshToken,{
  httpOnly:true,
  secure:true,
  sameSite:'None',
  maxAge:  7 * 24 * 60 * 60 * 1000 
 })


res.json({accessToken})

})



const refresh = (req,res) => {
  
  const cookie = req.cookies 


  if(!cookie?.jwt) return res.status(401).json({message:'No cookies'})
   

  const refreshToken = cookie.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async(err, decoded) => {
     if(err) return res.status(403).json({message:'forbidden'}) // means the token is not valid or expired
      
     const userFound = await User.findOne({username:decoded.username}).exec()

     if(!userFound) return res.status(401).json({message:'unauthorized'})

     const accessToken = jwt.sign(
      {
        "userInfo":{
          "username":userFound.username,
          "id": userFound._id
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn:'900sec'}
     )


     res.json({accessToken})
    })
    
  )
}



const logout = (req,res) => {
  const cookies = req.cookies

  if(!cookies?.jwt) return res.status(204)

  res.clearCookie('jwt',{httpOnly:true, secure:true, sameSite:'None'})
  res.json({message:'cookies cleared'})
}


module.exports = {login, refresh, logout}