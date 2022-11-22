const express = require('express')
const router = express.Router()
const path = require('path');





router.get('/',(req,res)=> {
  res.status(202).sendFile(path.join(__dirname,'../','views','public.html'))
})





module.exports = router