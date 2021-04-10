//Dependencies
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')

//Configuration
const config = require('./config')

//Route files
const authRouter = require('./src/routes/auth')
const userRouter = require('./src/routes/user')
const semesterRouter = require('./src/routes/semester')
const subjectRouter = require('./src/routes/subject')
const configurationRouter = require('./src/routes/configuration')
const scheduledSubjectRouter = require('./src/routes/scheduledSubject')

//general objects
const app = express()

//Middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded(config.urlencoded))
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use(authRouter)
app.use('/user', userRouter)
app.use('/semester', semesterRouter)
app.use('/subject', subjectRouter)
app.use('/scheduledSubject', scheduledSubjectRouter)
app.use('/configuration', configurationRouter)

module.exports = app
