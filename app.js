var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

const { checkAuth } = require('./src/middleware/auth');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/user');
var storeRouter = require('./src/routes/store');
var productRouter = require('./src/routes/product');
var categoryRouter = require('./src/routes/category');
var customerRouter = require('./src/routes/customer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger(':method :url :status :res[content-length] - :response-time ms :date[iso]'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'uploads')));

app.use('/', indexRouter);
app.use('/users', checkAuth, usersRouter);
app.use('/store', checkAuth, storeRouter);
app.use('/product',checkAuth, productRouter);
app.use('/category',checkAuth, categoryRouter);
app.use('/customer',checkAuth, customerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.error(err.message)
    // render the error page
    res.status(err.status || 500);
    res.send({ err: err.message });
});

mongoose.connect(process.env.DB_URL, {minPoolSize: 5, maxPoolSize: 10})
    .then(() => {
        console.log("Database Connection Success.");
    }).catch((err) => {
    console.error("Mongoose Error: ", err);
});

module.exports = app;
