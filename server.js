require('dotenv').config()
const express = require('express')
const app = express();
const PORT = process.env.PORT || 3500
const path = require('path')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const cors = require('cors')
const {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const {logEvents} = require('./middleware/logger')



connectDB()


// request logger 
app.use(logger);


// built in middleware
app.use('/',express.static(path.join(__dirname,'public')))
app.use(express.json()) // to parse JSON 
app.use(cookieParser()) //  allows us to parse received cookies 
app.use(cors(corsOptions));


// Routes
app.use('/',require('./routes/root'))
app.use('/register', require('./routes/userRoutes'))
app.use('/notes',require('./routes/noteRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/verify',require('./routes/verifyRoutes'))






// page not found
app.all('*',(req,res)=> {
   
  if(req.accepts('html')){
     res.status(404).sendFile(path.join(__dirname,'views','404.html'))
  }
  else if(req.accepts('json')){
    res.status(404).json({message:'not found 404'})
  }
  else {
    res.type('txt').send('error not found')
  }
})


app.use(errorHandler)


mongoose.connection.once('open',()=> {

  app.listen(PORT, ()=> {
    console.log(`server running on PORT ${PORT}`)
 })
 console.log("Connected to MongoDb")
})

mongoose.connection.on('error', err => {
  console.log(err)

  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrLog.js')
}) // error handler 


