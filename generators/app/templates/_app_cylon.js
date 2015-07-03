var cylon = require('cylon');
var config = require('./config');

cylon.robot({
    name: 'edison',
    connections: { edison: { adaptor: 'intel-iot' } },
    devices: { pin13: { driver: 'direct-pin', pin: 13 } },
    work: function (edison) {
        //you can use config.someConfigVariable from the config.js file
        edison.pin13.digitalWrite(1); //turn on the LED
        setTimeout(function(){ edison.pin13.digitalWrite(0);},2000); //after 2 seconds turn it back off
    }
}).start();

