const express = require('express');
const router = express.Router()
const uploadController = require('../controllers/uploadController')
const multer = require('multer')
const verifyJWT = require('../middleware/verifyJWT')
const path = require("path");

const storage = multer.diskStorage({
  destination:(req,file,callback) => {
     callback(null,'uploads')
  },
  filename:(req,file,callback) => {
     callback(null,Date.now() + file.originalname)
  }
})


const checkFileType = function (file, cb) {
//Allowed file extensions
      const fileTypes = /jpeg|jpg|png|gif|svg/;

      console.log(file)
      //check extension names
      const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

      const mimeType = fileTypes.test(file.mimetype);

      if (mimeType && extName) {
            return cb(null, true);
      } else {
            cb({message: 'You can Only Upload Images',status:400});
            }
};

const upload = multer(
      {storage:storage,
       fileFilter: (req, file, cb) => {checkFileType(file, cb);},
       limits:{fileSize:100000000}
      })



router.route('/')
      .get(verifyJWT,uploadController.getImageById)
      .post(verifyJWT,upload.single('profile-image'),uploadController.uploadImage)
 


router.route('/profileId')
      .post(verifyJWT,uploadController.getImageById)

router.route('/profileOptions')
      .post(uploadController.getImageByEmail)

router.route('/uploadProfile')
      .post(upload.single('profile-image'),uploadController.uploadImage)



module.exports = router;


  