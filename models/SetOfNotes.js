const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)


const SetOfNotesSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },

  title : {
     type:String,
     required:true
  },

},
 {
  timestamps:true
 }
)


SetOfNotesSchema.plugin(AutoIncrement,{
  inc_field:'ticket',
  id:'sonNums',
  start_seq: 500
})

module.exports = mongoose.model('SetOfNotes',SetOfNotesSchema)