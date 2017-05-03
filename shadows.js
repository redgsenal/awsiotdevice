const awsIot = require('aws-iot-device-sdk');
const five = require("johnny-five");
const Raspi = require("raspi-io");
const board = new five.Board({
  io: new Raspi()
});
var led;
board.on("ready", function() {
	console.log("board ready");
	led = new five.Led("P1-13");	
});

const deviceOpts = {
	keyPath: 'cert/cabinetIoT.private.key',
	certPath: 'cert/cabinetIoT.cert.pem',
	caPath: 'cert/root-CA.crt',
	clientId: 'cabinetIoT-device',
	region: 'us-east-1'
};
const shadows = awsIot.thingShadow(deviceOpts);
/*var device = awsIot.device(deviceOpts);*/

/*
device.on('connect', function(){
	console.log("device connected");
	device.publish('raspi', JSON.stringify({hello: 'just a test world'}));
	console.log("Device published");
});*/

var clientToken = '';

shadows.register('cabinetIoT', {
	persistentSubscribe: true
});
console.log("thing registered...");
console.log("listening for shadow...");		

/*shadows.on('connect', function(){
	console.log("device connected via shadow");	
	console.log("listening for shadow...");		
});*/

shadows.on('error', function(error) {
	console.log('error', error);
});

shadows.on('status', function(thingName, statusType, clientToken, stateObject) {
	console.log('status ', JSON.stringify(stateObject));
	console.log('** data  ', JSON.stringify(stateObject.state));
	if (led){
		var pin = stateObject.state.reported.pin;
		if (pin[1] == 'on'){
			led.on();
		}else{
			led.off();
		}
	}
});

shadows.on('message', function(topic, payload) {
	console.log('message', topic, payload.toString());
});

shadows.on('delta', function(thing, stateObject){
	console.log('delta on ' + thing + ' state : ' + JSON.stringify(stateObject));
	clientToken = shadows.update(thing, {
		state: {
			reported: stateObject.state
		}
	});
	console.log('shadow updated ', clientToken);
});

