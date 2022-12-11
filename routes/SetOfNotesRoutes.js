const express = require('express')
const router = express.Router()
const SetOfNotesController = require('../controllers/setofnotesController')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
         .get(verifyJWT,SetOfNotesController.getSetOfNotes)
         .post(verifyJWT,SetOfNotesController.createSetOfNotes)



module.exports = router