const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
 
 user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
 },
 connectedUser:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
 },
 messages:{
   type:Array,
   default:[]   
 }

},
{
   timestamps:true
 })



module.exports = mongoose.model('message',messageSchema)
