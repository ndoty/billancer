var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongo = require('mongoskin'),
    db = mongo.db("mongodb://localhost:27017/billancer", {native_parser:true}),
    routes = require('./routes/index'),
    bank = require('./routes/api/bank'),
    bills = require('./routes/api/bills'),
    transactions = require('./routes/api/transactions'),
    creditCards = require('./routes/api/creditCards'),
    debitCards = require('./routes/api/debitCards'),
    app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function (req, res, next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/api/bank', bank);
app.use('/api/bills', bills);
app.use('/api/transactions', transactions);
app.use('/api/creditCards', creditCards);
app.use('/api/debitCards', debitCards);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status (err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
