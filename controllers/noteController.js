const Note = require('../models/Note')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')





const getNotesByUser = asyncHandler(async(req,res) => {
  const {id} = req;


  if(!id){
     return res.status(400).json({message:'Bad request'})
  }
  

  const foundNotes = await Note.find({user:id}).exec()
  


  if(!foundNotes?.length){
    return res.status(204).json({message:'No note is found'})
  }


  res.json(foundNotes)

})




// const getNotesByUser = asyncHandler(async(req,res) => {
//   const {id} = req.body;

//   console.log(`id ${id}`)
//   if(!id){
//      return res.status(400).json({message:'Bad request'})
//   }
  

//   const foundNotes = await Note.find({user:id}).exec()
  


//   if(!foundNotes?.length){
//     return res.status(404).json({message:'No note is found'})
//   }


//   res.json(foundNotes)

// })



const getAllNotes = asyncHandler(async(req,res) => {
    
  const notes = await Note.find()


  if(!notes?.length){
  return res.status(400).json({message:'note is not found'})
  }

  res.json(notes)


})


const getNotesByActiveSON = asyncHandler(async(req,res)=>{

  const {activeSetofNotes} = req.body

  if(!activeSetofNotes){
    return res.status(400).json({message:'activeSetofNotes is undefined'})
  }
  
  const notesFound = await Note.find({parent:activeSetofNotes}).exec()

  if(!notesFound){
    return res.status(400).json({message:'no note is found'})
  }

  
  res.json(notesFound)



})


const createNewNotes = asyncHandler(async(req,res) => {
  
  const {activeSetofNotes} = req
  const {user,title,text} = req.body  

  
  if(!user || !activeSetofNotes){
    return res.status(400).json({message:'Bad request'})
  }

  console.log(activeSetofNotes)

  const note = await Note.create({user,title,text,parent:activeSetofNotes})

  if(note){
   return res.status(201).json(note)
  }else {
    return res.status(400).json({message:'Invalid note data received'})
  }
  

})


const updateNote = asyncHandler(async(req,res)=> {
  const {id, title,text} = req.body

  console.log(`id: ${id}, title:${title}, text:${text}`)
  if(!id){
    res.status(400).json({message:'cannot update'})
  }

  const note = await Note.findById({_id:id}).exec()
  
  if(!note){
   return res.status(400).json({message:'note is not found'})
  }
  
  note.title = title
  note.text = text

 const updatedNote = await note.save()

 res.json(updatedNote)
})


const deleteNote = asyncHandler(async(req,res) => {
 const {id} = req.body 


 if(!id){
  return res.status(400).json({message:'note Id is required'})
 }

 const foundNote = await Note.findById({_id:id}).exec()

 if(!foundNote){
   return res.status(404).json({message:'Note is not found'})
 }

 const deletedItem = await foundNote.deleteOne()


 return res.json({message:`The ${deletedItem.title} has been deleted`})


})




module.exports = {getNotesByUser,getNotesByActiveSON,getAllNotes,createNewNotes, updateNote, deleteNote}