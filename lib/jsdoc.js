var fs = require('fs')

exports.processContacts = function(jsdocPath, next) {
	var json = fs.readFileSync(jsdocPath, 'utf-8');
	json = JSON.parse(json);

	delete json.dialer;
	json.contacts.src.forEach(function(val, idx) {
		json.contacts.src[idx] = val.replace(/communications\/contacts/, 'contacts');
	});

	fs.writeFileSync(jsdocPath, JSON.stringify(json, null, '  ') + '\n', 'utf-8');
	next();
};

exports.processDialer = function(jsdocPath, next) {
	var json = fs.readFileSync(jsdocPath, 'utf-8');
	json = JSON.parse(json);

	delete json.contacts;
	json.dialer.src.forEach(function(val, idx) {
		json.dialer.src[idx] = val.replace(/communications\/dialer/, 'dialer');
	});

	fs.writeFileSync(jsdocPath, JSON.stringify(json, null, '  ') + '\n', 'utf-8');
	next();
};
