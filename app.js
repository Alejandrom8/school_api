//Dependencies
const express = require('express'),
      path = require('path'),
      morgan = require('morgan'),
      cors = require('cors');

//Configuration
const config = require('./config');

//Route files
const configurationRouter = require('./routes/configuration'),
      signRouter = require('./routes/sign'),
      userRouter = require('./routes/user');

//general objects
const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded(config.urlencoded));
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/config', configurationRouter);
app.use('/sign', signRouter);
app.use('/user', userRouter);

module.exports = app;
