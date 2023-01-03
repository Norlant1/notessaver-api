const {logEvents} = require('./logger')

const errorHandler = (err,req,res,next) => {
   logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,'errLog.log')

   const status = res.statusCode ? res.statusCode : 500

   
   res.status(err.status ? err.status : status)
   console.log(err)

   res.json({message:err.message, isError:true})
}

module.exports = errorHandler;