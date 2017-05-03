var awsIot = require('aws-iot-device-sdk');

var device = awsIot.device({
	keyPath: 'cabinetIoT.private.key',
	certPath: 'cabinetIoT.cert.pem',
	caPath: 'root-CA.crt',
	clientId: 'raspi',
	region: 'us-east-1'
});

device.on('connect', function(){
	console.log("device connected");
	device.publish('raspi', JSON.stringify({hello: 'just a test world'}));
	console.log("Device published");
});