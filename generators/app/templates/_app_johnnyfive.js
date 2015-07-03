var five = require("johnny-five");
var Edison = require("edison-io");
var config = require("./config");
var board = new five.Board({
  io: new Edison()
});

board.on("ready", function() {
  //you can use config.someConfigVariable from the config.js file
  var led = new five.Led(0);
  led.blink(500);
});