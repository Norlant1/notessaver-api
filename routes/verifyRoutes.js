const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Token = require('../models/token')


router.route('/:id/verifyaccount/:token')
      .get(async (req,res)=> {
        try {
    
           const user = await User.findOne({_id:req.params.id})
           if(!user) return res.status(400).send({message:'invalid link'})
    
           const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
           })
          
           if(!token) return res.status(400).send({message:'invalid link'})
    
           
           await user.updateOne({verified:true})
           await token.remove()
    
           res.status(200).send({message:'Email verified Successfully'})
        }catch(error){
          res.status(505).send({message:'internal server error'})
          console.log(error)
        }
    
    })

 

module.exports = router