var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('lib/mongoose');

var routes = require('./routes/index');
var countries = require('./routes/countries');
var countries_reviews = require('./routes/countries-reviews');
var cities = require('./routes/cities');
var cities_reviews = require('./routes/cities-reviews');
var places = require('./routes/places');
var places_reviews = require('./routes/places-reviews');

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
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/countries/reviews', countries_reviews); // path to reviews
app.use('/api/cities/reviews', cities_reviews); // path to reviews
app.use('/api/places/reviews', places_reviews); // path to reviews
app.use('/api/countries', countries); // path to CRUD methods on countries
app.use('/api/cities', cities); // path to CRUD methods on cities
app.use('/api/places', places); // path to CRUD methods on places


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
