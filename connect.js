var awsIot = require('aws-iot-device-sdk');

var device = awsIot.device({
	keyPath: 'cert/cabinetIoT.private.key',
	certPath: 'cert/cabinetIoT.cert.pem',
	caPath: 'cert/root-CA.crt',
	clientId: 'raspi-connect',
	region: 'us-east-1'
});

device.on('connect', function(){
	console.log("device connected");
	device.publish('raspi', JSON.stringify({hello: 'just a test world'}));
	console.log("Device published");
});