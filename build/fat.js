/**
 * @description generate files from markdown file
 * @author sunnylost
 * @version 0.0.2
 */

var fs 		 = require('fs'),
    ejs 	 = require('ejs'),
    md 		 = require('markdown').markdown,
    Promise  = require('promise'),

    htmlToMd,

    readfile = Promise.denodeify(fs.readFile),
	
	readdir  = Promise.denodeify(fs.readdir),

    /**
     * 列表页对象
     * @type {Object}
     */
    listObj = {},

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
    var parseArticleFn;

    readfile(PATH_TEMPLATE + 'article.ejs', ENCODING)
    	.then(function(data) {
    		parseArticleFn = ejs.compile(data);
    		return readdir(path);
    	}).then(function(files) {
    		return generateHTML(files);
    	});

    function generateHTML(files) {
		var filename = files.shift();
		if(!rfiletype.test(filename)) return files.length ? generateHTML(files) : generateArticlesList();

		readfile(path + filename, ENCODING)
			.then(function(data) {
				var metas = {};
				data = data.replace(rmeta, function(text, n, v) {
					metas[n] = v;
					return '';					
				});
				(listObj[metas.list] || (listObj[metas.list] = [])).push(metas);
				var html = parseArticleFn({
					title: metas.title,
					content: md.toHTML(data)
				});

				fs.writeFile(PATH_ARTICLE + metas.filename + '.html', html.replace(/<code>/g, '<code class="language-javascript">'), function() {
					files.length ? generateHTML(files) : generateArticlesList();
				});
			})
	}
};

function generateArticlesList() {
	readfile(PATH_TEMPLATE + 'article-index.ejs', ENCODING)
		.then(function(data) {
			fs.writeFile(PATH_ARTICLE + 'index.html', ejs.compile(data)({
				list: listObj
			}));
		})
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
