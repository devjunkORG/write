var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug');
var routes = require('./routes/index');

var app = express();

app.set('port', process.env.PORT || 3001);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});

var io = require('socket.io').listen(server);

var users = 0;
io.sockets.on('connection', function (socket) {
    users++;
    console.log(`Connections: ${users}`);
    socket.broadcast.emit('info', { connections: users });
    socket.on('chat data', function(data) {
        console.log('data received');
        socket.broadcast.emit('message received', data);
    });
    socket.on('disconnect', function(data) {
        users--;
        console.log(`Connections: ${users}`);
        socket.broadcast.emit('info', { connections: users });
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
