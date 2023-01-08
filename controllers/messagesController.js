const asyncHandler = require('express-async-handler');
const Message = require('../models/Message')


const getMessagesByConnectedUsers = asyncHandler(async(req,res)=> {
  
   const {userId,connectedUserId} = req.body
   
   
   const foundMessages = await Message.findOne({user:userId,connectedUser:connectedUserId}).exec()

   if(!foundMessages){
      const createdMessage = await Message.create({user:userId,connectedUser:connectedUserId})
      if(!createdMessage){
         return res.status(400).json({message:'invalid data received'})
      }
      res.json(createdMessage)
   }
   else{
      res.json(foundMessages)
   }  
 
 })
 



 module.exports = {getMessagesByConnectedUsers}