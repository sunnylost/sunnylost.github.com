/**
 * @description generate files from markdown file
 * @author sunnylost
 * @version 0.0.1
 */

var fs = require('fs'),
    ejs = require('ejs'),
    md = require('markdown').markdown,
    list = {},
    htmlToMd;

function parse(path) {
	ejs.open = '{{';
    ejs.close = '}}';

	fs.readFile('../assets/template/article.ejs', {
		encoding: 'utf-8'
	}, function(err, data) {
		var fn = ejs.compile(data);

		var rfiletype = /\.md$/,
			rmeta = /@(title|filename|list):\s*(.+)/g;

		fs.readdir(path, function generateHTML(err, files) {
			var filename = files.shift();
			if(!rfiletype.test(filename)) return files.length ? generateHTML(null, files) : generateArticlesList();
	    	fs.readFile(path + filename, {
				encoding: 'utf-8'
			}, function(err, data) {
				var metas = {};
				data = data.replace(rmeta, function(text, n, v) {
					metas[n] = v;
					return '';					
				});
				(list[metas.list] || (list[metas.list] = [])).push(metas);
				var html = fn({
					title: metas.title,
					content: md.toHTML(data)
				});
	
				fs.writeFile('../article/' + metas.filename + '.html', html.replace(/<code>/g, '<code class="language-javascript">'), function() {
					files.length ? generateHTML(null, files) : generateArticlesList();
				});
			})
	    })
	})
};

function generateArticlesList() {
	fs.readFile('../assets/template/article-index.ejs', {
		encoding: 'utf-8'
	}, function(err, data) {
		var fn = ejs.compile(data),
			values,
			v,
			html = [];

		for(var key in list) {
			if(key === 'undefined') continue;
			values = list[key];
			html.push('<section><h2>' + key + '</h2><ul>');
			for(var i = 0, len = values.length; i < len; i++) {
				v = values[i];
				html.push('<li><a href="' + v.filename + '.html">' + v.title + '</a></li>')
			}
			html.push('</ul></section>');
		}
		fs.writeFile('../article/index.html', fn({
			content: html.join('')
		}));
	});
}

/**
 * reverse a markdown file to HTML.
 * @param path
 */
function reverse(path) {
    htmlToMd = htmlToMd || require('to-markdown').toMarkdown;
    fs.readdir(path, function(err, files) {
    	convertHtmlToMarkdown(files);
    })
};

function convertHtmlToMarkdown(files) {
	var filename = files.shift();
	fs.readFile('../article/' + filename, {
		encoding: 'utf-8'
	}, function(err, data) {
		fs.writeFile('../build/' + filename.replace('html', 'md'), htmlToMd(data.replace(/<(\/)?pre>/g, '')), function() {
			files.length && convertHtmlToMarkdown(files)
		})
	})
}

//reverse('../article/');
parse('../draft/');
