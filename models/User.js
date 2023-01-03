const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
    email:{
      type:String,
      required:true
    }
  ,
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  active:{
    type:Boolean,
    default:true
  },
  verified: {
    type:Boolean,
    default:false
  },
  activeSetofNotes:{
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  roles:{
    type:Array,
    required:true,
    default:['user']
  }
})


module.exports = mongoose.model('User',userSchema)