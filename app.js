//Dependencies
const express = require('express'),
      path = require('path'),
      morgan = require('morgan'),
      cors = require('cors');

//Configuration
const config = require('./config');

//Route files
const authRouter = require('./src/routes/auth'),
      userRouter = require('./src/routes/user'),
      semesterRouter = require('./src/routes/semester'),
      subjectRouter = require('./src/routes/subject'),
      scheduledSubjectRouter = require('./src/routes/scheduledSubject');

//general objects
const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded(config.urlencoded));
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use(authRouter);
app.use('/user', userRouter);
app.use('/semester', semesterRouter);
app.use('/subject', subjectRouter);
app.use('/scheduledSubject', scheduledSubjectRouter);

module.exports = app;