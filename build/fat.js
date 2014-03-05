/**
 * @description generate files from markdown file
 * @author sunnylost
 * @version 0.0.1
 */

var fs = require('fs'),
    ejs = require('ejs'),
    md = require('markdown').markdown,
    htmlToMd,

    /**
     * 列表页对象
     * @type {Object}
     */
    list = {},

    /**
     * 匹配 markdown 文件
     */
    rfiletype = /\.md$/,

    /**
     * 匹配 markdown 文件中的 meta
     * meta 是我自己定义的，目前包括：
     * 		title：文件标题
     * 	 	filename：文件名
     * 	 	list：所属系列名称
     * @type {RegExp}
     */
	rmeta = /@(title|filename|list):\s*(.+)/g,

    RELATIVE_PATH = '../',

    PATH_ARTICLE  = RELATIVE_PATH + 'article/',

    PATH_TEMPLATE = RELATIVE_PATH + 'assets/template/',

    ENCODING = 'utf-8';

function parse(path) {
	ejs.open  = '{{';
    ejs.close = '}}';

	fs.readFile(PATH_TEMPLATE + 'article.ejs', {
		encoding: ENCODING
	}, function(err, data) {
		var fn = ejs.compile(data);

		fs.readdir(path, function generateHTML(err, files) {
			var filename = files.shift();
			if(!rfiletype.test(filename)) return files.length ? generateHTML(null, files) : generateArticlesList();
	    	fs.readFile(path + filename, {
				encoding: ENCODING
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
	
				fs.writeFile(PATH_ARTICLE + metas.filename + '.html', html.replace(/<code>/g, '<code class="language-javascript">'), function() {
					files.length ? generateHTML(null, files) : generateArticlesList();
				});
			})
	    })
	})
};

function generateArticlesList() {
	fs.readFile(PATH_TEMPLATE + 'article-index.ejs', {
		encoding: ENCODING
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
		fs.writeFile(PATH_ARTICLE + 'index.html', fn({
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
	fs.readFile(PATH_ARTICLE + filename, {
		encoding: ENCODING
	}, function(err, data) {
		fs.writeFile('../build/' + filename.replace('html', 'md'), htmlToMd(data.replace(/<(\/)?pre>/g, '')), function() {
			files.length && convertHtmlToMarkdown(files)
		})
	})
}

//reverse('../article/');
parse('../draft/');
