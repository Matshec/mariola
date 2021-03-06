const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('./config/passport-mariola/passport');
const api = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());

app.use('/api', api);
app.use((err, req, res, next) => {

    res
        .status(err.status || 500)
        .json({message: err.message})
});


module.exports = app;