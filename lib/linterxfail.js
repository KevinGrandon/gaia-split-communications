var fs = require('fs')

exports.processJshintXfail = function(gaiaPath) {
	var xfailPath = gaiaPath + '/build/jshint/xfail.list';
	var xfailContent = fs.readFileSync(xfailPath, 'utf-8');

	xfailContent = xfailContent.replace(/apps\/communications\/dialer+/g, 'apps/dialer');
	xfailContent = xfailContent.replace(/apps\/communications\/facebook+/g, 'apps/contacts/facebook');

	fs.writeFileSync(xfailPath, xfailContent, 'utf-8');
};

exports.processCsslintXfail = function(gaiaPath) {
	var xfailPath = gaiaPath + '/build/csslint/xfail.list';
	var xfailContent = fs.readFileSync(xfailPath, 'utf-8');

	xfailContent = xfailContent.replace(/apps\/communications\/contacts+/g, 'apps/contacts');
	xfailContent = xfailContent.replace(/apps\/communications\/dialer+/g, 'apps/dialer');

	fs.writeFileSync(xfailPath, xfailContent, 'utf-8');
}