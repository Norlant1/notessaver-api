const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');





const verifyJWT = asyncHandler(async(req,res,next) => {
  
 const authHeader = req.headers.authorization || req.headers.Authorization
 



 if(!authHeader?.startsWith('Bearer ')) return res.status(401).json({message:'unthorized'})
 
 
 const token = authHeader.split(' ')[1]

//  if(token === 'undefined')return res.status(401).json({message:'token is undefined'})

 jwt.verify(
  token,
  process.env.ACCESS_TOKEN_SECRET,
  (err,decoded) => {
    
    
    if(err) return res.status(403).json({message:'token expired'})
    req.user = decoded.userInfo.username
    req.id = decoded.userInfo.id
    req.activeSetofNotes = decoded.userInfo.activeSetofNotes

  
    next()
  }
 )



})



module.exports = verifyJWT