var exec = require('child_process').exec;
var manifest = require('./lib/manifest');

var gaiaDir = __dirname + '/../gaia';
var appsDir = gaiaDir + '/apps';
var commsAppDir = appsDir + '/communications';
var oldContactsAppDir = commsAppDir + '/contacts';
var oldDialerAppDir = commsAppDir + '/dialer';
var newContactsAppDir = appsDir + '/contacts';
var newDialerAppDir = appsDir + '/dialer';

var steps = [
	function() {
		console.log('Starting contact split script.');
		next();
	},

	function() {
		console.log('Making dialer directory.');
		exec('mkdir ' + newDialerAppDir, next);
	},

	function() {
		console.log('Making contacts directory.');
		exec('mkdir ' + newContactsAppDir, next);
	},

	function() {
		console.log('Move contacts code.');
		exec('mv ' + oldContactsAppDir + '/* ' + newContactsAppDir + '/.', next);
	},

	function() {
		console.log('Move dialer code.');
		exec('mv ' + oldDialerAppDir + '/* ' + newDialerAppDir + '/.', next);
	},

	function() {
		console.log('Copy manifest for contacts.');
		exec('cp ' + commsAppDir + '/manifest.webapp ' + newContactsAppDir + '/manifest.webapp', next);
	},

	function() {
		console.log('Augment manifest for contacts.');
		manifest.processContacts(newContactsAppDir + '/manifest.webapp', next);
	},

	function() {
		console.log('Copy manifest for dialer.');
		exec('cp ' + commsAppDir + '/manifest.webapp ' + newDialerAppDir + '/manifest.webapp', next);
	},

	function() {
		console.log('Augment manifest for dialer.');
		manifest.processDialer(newDialerAppDir + '/manifest.webapp', next);
	}
];

function next() {
	if (!steps.length) {
		console.log('All done!');
		return;
	}

	var step = steps.shift();
	step();
}

next();
