var fs = require('fs')

function extractEntryPoint(json, entryPoint) {
	for (var i in json.entry_points[entryPoint]) {
		json[i] = json.entry_points[entryPoint][i];
	}

	delete json.entry_points;
	return json;
}

exports.processContacts = function(manifestPath, next) {
	var json = fs.readFileSync(manifestPath, 'utf-8');
	json = JSON.parse(json);

	json = extractEntryPoint(json, 'contacts');

	json.messages = json.messages.filter(function(o) {
	    return o[Object.keys(o)[0]].indexOf('/dialer') === -1
	});

	fs.writeFileSync(manifestPath, JSON.stringify(json, null, '  ') + '\n', 'utf-8');

	next();
};

exports.processDialer = function(manifestPath, next) {
	var json = fs.readFileSync(manifestPath, 'utf-8');
	json = JSON.parse(json);

	json = extractEntryPoint(json, 'dialer');

	delete json['datastores-owned'];
	delete json.redirects;

	json.messages = json.messages.filter(function(o) {
	    return o[Object.keys(o)[0]].indexOf('/dialer') === 0
	});

	fs.writeFileSync(manifestPath, JSON.stringify(json, null, '  ') + '\n', 'utf-8');

	next();
};
