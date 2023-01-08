const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')




router.route('/')
    .get(verifyJWT,userController.getAllUsers)
    .post(userController.createNewUser)
    .patch(verifyJWT,userController.updateUser)
    .delete(verifyJWT,userController.deleteAllUsers)



router.route('/user-email')
    .post(userController.getUserByEmail)


module.exports = router;