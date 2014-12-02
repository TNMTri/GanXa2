//Mặc định
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//Session:
var session = require('express-session');
var multer = require('multer');
//Connect database:
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/GanXa');
//Routes
var index = require('./routes/index');
var insert_store = require('./routes/insert_store');
var edit_store = require('./routes/edit_store');
var search = require('./routes/search');
var store_detail = require('./routes/store_detail');
var insert_product = require('./routes/insert_product');
var edit_product = require('./routes/edit_product');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'ganxa',resave: true, saveUninitialized: true}));
app.use(multer({dest: './public/images/'}));

app.use('/', index);
app.use('/insert_store', insert_store);
app.use('/edit_store', edit_store);
app.use('/search', search);
app.use('/store_detail', store_detail);
app.use('/insert_product', insert_product);
app.use('/edit_product', edit_product);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;