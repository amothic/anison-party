var app = require('./application');

var lame = require('lame');
var throttle = require('throttle');

var SAMPLE_SIZE = 16;
var CHANNELS = 2;
var SAMPLE_RATE = 44100;
var BLOCK_ALIGN = SAMPLE_SIZE / 8 * CHANNELS;
var BYTES_PER_SECOND = SAMPLE_RATE * BLOCK_ALIGN;

var throttle = new throttle(BYTES_PER_SECOND);

var encoder = new lame.Encoder({
  channels: 2,
  bitDepth: 16,
  sampleRate: 44100,
  bitRate: 320,
  outSampleRate: 44100,
  mode: lame.STEREO
});

process.stdin.pipe(throttle).pipe(encoder);

var clients = [];
encoder.on("data", function(chunk) {
  clients.forEach(function(client) {
    client.write(chunk);
  });
});

var app = new app();
app.on('connected', function(res) {
  clients.push(res);
  console.log('Client connected : ' + clients.length); 
});

app.on('disconnected', function(res) {
  clients = clients.filter(function(c) { return res !== c; });
  console.log('Client disconnected : ' + clients.length);
});

