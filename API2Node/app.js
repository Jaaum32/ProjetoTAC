var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');
const mongoose = require("mongoose");
const cors = require("cors");

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

// Configurações de CORS
const corsOptions = {
    origin: '*', // Permite todas as origens (não recomendado em produção)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    exposedHeaders: ['Authorization'], // Cabeçalhos que podem ser expostos
};

// Ativando o middleware CORS
app.use(cors(corsOptions));

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', logger, indexRouter);
// app.use('/auth', logger, require('./routes/auth'))
// app.use('/users', logger, usersRouter);
// app.use('/cowlocation', logger, cowLocationRouter);
// app.use('/geofence', logger, geofenceRouter);

app.use('/', indexRouter);
app.use('/auth', require('./routes/auth'))
app.use('/users', usersRouter);
app.use('/cowlocation', cowLocationRouter);
app.use('/geofence', geofenceRouter);

module.exports = app;