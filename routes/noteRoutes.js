const express = require('express');
const router = express.Router()
const noteController = require('../controllers/noteController')
const verifyJWT = require('../middleware/verifyJWT')


router.use(verifyJWT)

router.route('/')
.get(noteController.getAllNotes)
.post(noteController.createNewNotes)
.patch(noteController.updateNote)
.delete(noteController.deleteNote)

router.route('/notes')
.get(noteController.getNotesByUser)

router.route('/active-notes')
.post(noteController.getNotesByActiveSON)







module.exports = router;