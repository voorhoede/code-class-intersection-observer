const path = require('path');
const promisify = require('bluebird').promisify;
const createDir = promisify(require('mkdirp'));
const fs = require("fs");
const writeFile = promisify(fs.writeFile);

const paths = require('../lib/paths');
const renderer = require('../lib/renderer');

/**
 * Gets the path of a certain template. Templates have the same filename
 * as their folders
 *
 * @param  {String} name
 * @return {String}
 */
function getTemplatePath(name) {
	return path.join('views', name);
}

/**
 * Save html content to file
 *
 * @param  {String} slug
 * @param  {String} content (Usually HTML)
 * @return {Promise}
 */
function saveStaticHTML(filename, content) {
	let folderPath = paths.static;
	const slug = path.basename(filename, '.html')
	if (slug !== 'index') { // Exception made for home page, which will be written directly to static/index.html
		folderPath = path.join(paths.static, slug);
	}
	const filePath = path.join(folderPath, 'index.html');
	return createDir(folderPath)
		.then(() => {
			return writeFile(filePath, content)
				.then(() => {
					return filePath;
				})
		});
}

fs.readdir(paths.views, (err, files) => {
	files.forEach(templateName => {
		if(!templateName.startsWith("_")) {
			const html = renderer.render(path.join('views', templateName));
			saveStaticHTML(templateName, html)
				.then(filePath => {
					console.log(`Wrote ${filePath}`)
				})
		}
	});
})
