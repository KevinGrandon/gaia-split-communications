var exec = require('child_process').exec;

var homescreen = require('./lib/homescreen');
var jsdoc = require('./lib/jsdoc');
var manifest = require('./lib/manifest');
var pathFixer = require('./lib/path_fixer');

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
	},

	function() {
		console.log('Copy jsdoc for contacts.');
		exec('cp ' + commsAppDir + '/jsdoc.json ' + newContactsAppDir + '/jsdoc.json', next);
	},

	function() {
		console.log('Augment jsdoc for contacts.');
		jsdoc.processContacts(newContactsAppDir + '/jsdoc.json', next);
	},

	function() {
		console.log('Copy jsdoc for dialer.');
		exec('cp ' + commsAppDir + '/jsdoc.json ' + newDialerAppDir + '/jsdoc.json', next);
	},

	function() {
		console.log('Augment jsdoc for dialer.');
		jsdoc.processDialer(newDialerAppDir + '/jsdoc.json', next);
	},

	function() {
		console.log('Move build scripts into contacts.');
		exec('mv ' + commsAppDir + '/build ' + newContactsAppDir + '/build', next);
	},

	function() {
		console.log('Move facebook scripts into contacts.');
		exec('mv ' + commsAppDir + '/facebook ' + newContactsAppDir + '/facebook', next);
	},

	function() {
		console.log('Augment homescreen placement definition.');
		homescreen.processPlacement(gaiaDir, next);
	},

	function() {
		console.log('Move test media into contacts.');
		exec('mv ' + commsAppDir + '/test/unit/media ' + newContactsAppDir + '/test/unit/media', next);
	},

	function() {
		console.log('Copy unit test setup.js into dialer.');
		exec('cp ' + commsAppDir + '/test/unit/setup.js ' + newContactsAppDir + '/test/unit/setup.js', next);
	},

	function() {
		console.log('Copy unit test setup.js into contacts.');
		exec('cp ' + commsAppDir + '/test/unit/setup.js ' + newDialerAppDir + '/test/unit/setup.js', next);
	},

	function() {
		console.log('Fixing loads of paths...');
		pathFixer.updateHtmlScripts(newContactsAppDir, 'contacts');
		pathFixer.updateHtmlScripts(newDialerAppDir, 'dialer');

		pathFixer.updateHtmlLinks(newContactsAppDir, 'contacts');
		pathFixer.updateHtmlLinks(newDialerAppDir, 'dialer');

		pathFixer.updateScriptPaths(newContactsAppDir, 'contacts');
		pathFixer.updateScriptPaths(newDialerAppDir, 'dialer');
		next();
	},

	function() {
		console.log('Applying import config patch to contacts.');
		exec('cd ' + gaiaDir + ' && patch -p1 < ' + __dirname + '/patches/build_import_config.diff', next);
	},

	function() {
		console.log('Applying import config patch to ftu.');
		exec('cd ' + gaiaDir + ' && patch -p1 < ' + __dirname + '/patches/build_ftu_generate_config.diff', next);
	},

	function() {
		console.log('Applying build app list.');
		exec('cd ' + gaiaDir + ' && patch -p1 < ' + __dirname + '/patches/build_production_app_list.diff', next);
	},

	function() {
		console.log('Applying contacts build patch.');
		exec('cd ' + gaiaDir + ' && patch -p1 < ' + __dirname + '/patches/contacts_build_build.diff', next);
	},

	function() {
		console.log('Remove old folders.');
		exec('cd ' + commsAppDir + ' && rm -rf style/ manifest.webapp contacts/ dialer/ test/ jsdoc.json', next);
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
