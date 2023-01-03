const SetOfNotes = require('../models/SetOfNotes')
const asyncHandler = require('express-async-handler')



const getSetOfNotes = asyncHandler(async(req,res)=> {
   const {id} = req;


   console.log(`get note id ${id}`)
   if(!id){
    return res.status(400).json({message:'id is undefined'})
   }

   const foundSOT = await SetOfNotes.find({user:id}).exec()
   

   if(!foundSOT){
    return res.status(404).json({message:'no set of notes is found'})
   }

   
   res.json(foundSOT)
  

})

const createSetOfNotes = asyncHandler(async(req,res)=> {
  const {id,title} = req.body;

 
  if(!id || !title){
    return res.status(400).json({message:'List must have a title'})
   }
   
   
   const createdSOT = await SetOfNotes.create({user:id,title})
   
   if(!createdSOT){
     return res.status(400).json({message:'invalid note data received'})
   }
   

     createdSOT.title = title
     await createdSOT.save()
  


   res.json(createdSOT)
})



const deleteSetOfNotes = asyncHandler(async(req,res) => {
   
  const {id} = req.body

  
  if(!id){
    return res.status(400).json({message:'note Id is required'})
  }

  const foundSetOfNotes = await SetOfNotes.findById({_id:id}).exec()

  if(!foundSetOfNotes){
    return res.status(404).json({message:'Set of Notes is not found'})
  }

  const deletedItem = await foundSetOfNotes.deleteOne()


  return res.json(deletedItem._id)



})






module.exports = {getSetOfNotes,createSetOfNotes,deleteSetOfNotes}