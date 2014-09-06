var fs = require('fs')

exports.processPlacement = function(gaiaPath, next) {
	var jsonPath = gaiaPath + '/apps/verticalhome/build/default-homescreens.json';
	var json = fs.readFileSync(jsonPath, 'utf-8');
	/*
	json = JSON.parse(json);

	json.homescreens.forEach(function(page, pageIdx) {
		page.forEach(function(app, appIdx) {
			if (app[1] === 'communications') {
				json.homescreens[pageIdx][appIdx].splice(1, 1);
			}
		})
	});

	fs.writeFileSync(jsonPath, JSON.stringify(json, null, '  ') + '\n', 'utf-8');
	*/

	// For formatting purposes, just do a replace on the content.
	json = json.replace(/\"communications\",\s*/g, '');
	fs.writeFileSync(jsonPath, json, 'utf-8');

	next();
};
