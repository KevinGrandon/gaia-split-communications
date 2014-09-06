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
		console.log(linkReplacer)
		content = content.replace(linkReplacer, '$1/$3$4');

		fs.writeFileSync(filePath, content, 'utf-8');
	})
};

exports.updateHtmlScripts = function(folderPath) {

};
