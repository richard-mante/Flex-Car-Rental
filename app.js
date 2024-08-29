const ejs = require('ejs')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport');


const authInit = require('./config/auth-config');
const dbUri = require('./config/dbConfig')
const routs = require('./routes/pages')
const UserModel = require('./models/user');


const app = express()


// register view engine
app.set('view engine', 'ejs')


mongoose.connect(dbUri)
    .then((res) => {
        // listen for request
        app.listen('3000', () => {
            console.log("listening on http://localhost:3000/");
        });
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err);
    })


//logger middle ware
// app.use(morgan('dev'));

//middle ware for serving static files
app.use(express.static('public'));

//use routs
app.use(routs);

