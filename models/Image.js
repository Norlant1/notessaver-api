const mongoose = require('mongoose')



const imageSchema = new mongoose.Schema({  
  name:String,
  img:{
    data:Buffer,
    contentType: String
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  }
})




module.exports = mongoose.model('Image',imageSchema)