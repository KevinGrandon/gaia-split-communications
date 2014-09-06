var fs = require('fs')

function getFiles(dir, filterRegex, files_) {
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_ = [];
    var files = fs.readdirSync(dir);
    for(var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, filterRegex, files_);
        } else {
        	if (filterRegex && !filterRegex.test(name)) {
        		continue;
        	}
            files_.push(name);
        }
    }
    return files_;
}

exports.updateHtmlLinks = function(folderPath, appName) {
	var htmlFiles = getFiles(folderPath, /.*\.html$/);
	htmlFiles.forEach(function(filePath) {
		var content = fs.readFileSync(filePath, 'utf-8');

		var linkReplacer = new RegExp("(link.*href=\")(\/" + appName + "/)(.*)(\")", "g");
		content = content.replace(linkReplacer, '$1/$3$4');

		fs.writeFileSync(filePath, content, 'utf-8');
	})
};

exports.updateHtmlScripts = function(folderPath, appName) {
	var htmlFiles = getFiles(folderPath, /.*\.html$/);
	htmlFiles.forEach(function(filePath) {
		var content = fs.readFileSync(filePath, 'utf-8');

		var scriptReplacer = new RegExp("(<script.*src=\")(\/" + appName + "/)(.*)(\")", "g");
		content = content.replace(scriptReplacer, '$1/$3$4');

		fs.writeFileSync(filePath, content, 'utf-8');
	})
};

exports.updateScriptPaths = function(folderPath, appName) {
	var jsFiles = getFiles(folderPath, /.*\.js$/);
	console.log('Got js files:', jsFiles)
	jsFiles.forEach(function(filePath) {
		var content = fs.readFileSync(filePath, 'utf-8');

		//'/contacts/js/export/sd.js'
		var scriptReplacer = new RegExp("(\\'\/" + appName + "/js/)(.*\.js\\')", "g");
		console.log('REGEX:', scriptReplacer)
		content = content.replace(scriptReplacer, '\'/js/$2');

		fs.writeFileSync(filePath, content, 'utf-8');
	})
};
