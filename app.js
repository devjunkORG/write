var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug');
var routes = require('./routes/index');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var app = express();

app.set('port', process.env.PORT || 3001);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});

var io = require('socket.io').listen(server);
var editorState = mongoose.Schema({
    data: Object
});
var stateModel = mongoose.model('editorState', editorState);

var users = 0;
var latestState;
setInterval(() => {
    console.log('Saving current editor state');
    if (latestState) {
        var State = new stateModel({ data: latestState });
        State.save((err,State) => {
            if (err) {
                return console.error(err);
            }
            return console.log('Latest editor state saved.')
        });
    }
},15000);
io.sockets.on('connection', function (socket) {
    users++;
    console.log(`Connections: ${users}`);
    stateModel.findOne().sort({ created_at: -1 }).exec((err,state) => {
        if (err) {
            return console.error('Could not get latest saved editor state', err);
        }
        return socket.broadcast.emit('message received', state);
    });
    socket.broadcast.emit('info', { connections: users });
    socket.on('chat data', function(data) {
        latestState = data;
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
app.use(bodyParser.json({ extended: false }));
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
