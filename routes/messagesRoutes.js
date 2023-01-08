const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');



router.route('/messagesById')
      .post(messagesController.getMessagesByConnectedUsers);


module.exports = router;