var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var express = require('express');

var _e = {
  connected : 'connected',
  disconnected : 'disconnected',
};

function Application() {
  EventEmitter.call(this);
  var app = express();
  var self = this;

  app.engine('jade', require('jade').__express);
  app.set('view engine', 'jade');

  app.get('/music', function(req, res) {
    self.emit(_e.connected, res);
    res.on('close', function() {
      self.emit(_e.disconnected, res);
    });
  });

  app.get('/', function(req, res) {
    res.render('index', { title: 'anison Party' });
  });

  var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Lets ansion Party at http://%s:%s", host, port);
  });
}
inherits(Application, EventEmitter);


module.exports = Application;
