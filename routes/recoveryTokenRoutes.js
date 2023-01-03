const express = require('express');
const router = express.Router()
const RecoveryTokenController = require('../controllers/recoveryTokenController')


router.route('/')
      .post(RecoveryTokenController.createRecoverToken)


router.route('/code')
      .get(RecoveryTokenController.getUserbyRecovery)

router.route('/compareToken')
      .post(RecoveryTokenController.compareRecoveryToken)

router.route('/changePassword')
      .post(RecoveryTokenController.changePasswordByToken)



module.exports = router