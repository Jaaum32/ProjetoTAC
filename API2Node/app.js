var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");

require("dotenv").config();

// CONEXÃO COM O BANCO DE DADOS
const { MONGODB_URL } = process.env;

mongoose.connect(MONGODB_URL, {})
    .then(() => { 
        console.log("Conectado ao MongoDB."); 
    })
    .catch((err) => { 
        console.log("Falha ao conectar com o MongoDB: ", err);
    });



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cowLocationRouter = require('./routes/CowLocation');
var geofenceRouter = require('./routes/Geofence')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', logger, indexRouter);
app.use('/auth', logger, require('./routes/auth'))
app.use('/users', logger, usersRouter);
app.use('/cowlocation', logger, cowLocationRouter);
app.use('/geofence', logger, geofenceRouter);

module.exports = app;