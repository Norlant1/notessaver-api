const asyncHandler = require('express-async-handler')
const Image = require('../models/Image')
const User = require('../models/User')
const fs = require('fs')
const path = require('path')





const getImage = asyncHandler(async(req,res)=> {
   
  const datas = await Image.find()


  if(!datas){
    return res.status(204).json({message:'no image is found'})
  }

  res.json(datas)
})

const getImageByEmail = asyncHandler(async(req,res)=> {
 const {email,number} = req.body
   
 if(!email && !number) {
  return res.status(400).json({message:'email or number required'})
}

const foundUser = await User.findOne(email ? {email}:{phoneNumber:number}).select('-password').exec()

if(!foundUser){
  return res.status(204).json({message:'no user is found'})
}

const {_id} = foundUser

const foundImage = await Image.findOne({user:_id}).exec()

if(!foundImage){
  return res.status(204).json({message:'no user is found'})
}


res.json(foundImage)

})



const getImageById = asyncHandler(async(req,res)=> {
    
  const {id} = req.body;

  if(!id) {
     return res.status(400).json({message:'id is required'})
  }


  const foundImage = await Image.findOne({user:id}).exec()


  if(!foundImage){
    return res.status(204).json({message:'no image is found'})
  }

  res.json(foundImage)
})






const uploadImage = asyncHandler(async(req,res)=> {

 
  const {name,id} = req.body
  const {filename} = req.file


  
  
  if(!req.file){
    return res.status(400).json({message:'Please upload a valid image'})
  }

  if(!name || !id) return res.status(400).json({message:"404"})



  const foundImage = await Image.findOne({user:id}).exec()


  if(foundImage){
    
     foundImage.img = {
      data: fs.readFileSync('uploads/' + filename),
      contentType: 'image/png'
     }
 
     foundImage.name = name

     const updatedImage = await foundImage.save()
     
     
     res.json(updatedImage)
  }else {
     
    const createdImage = await Image.create({
      name:name,
      img:{
       data: fs.readFileSync('uploads/' + req.file.filename),
       contentType: 'image/png'
      },
      user:id
   })


   if(!createdImage){
    return res.status(400).json({message:'Invalid note data received'})
  }

  res.json(createdImage)




  }



  

   
  

})


module.exports = {uploadImage,getImage,getImageById,getImageByEmail}