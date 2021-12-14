/**
 * @description generate files from markdown file
 * @author sunnylost
 * @version 0.0.2
 */
const fs = require('fs')
const util = require('util')
const ejs = require('ejs')
const md = require('markdown').markdown
let htmlToMd
const readfile = util.promisify(fs.readFile)
const readdir = util.promisify(fs.readdir)
/**
 * 列表页对象
 * @type {Object}
 */
let listObj = {}
/**
 * 匹配 markdown 文件
 */
let rfiletype = /\.md$/
/**
 * 匹配 markdown 文件中的 meta
 * meta 是我自己定义的，目前包括：
 *        title：文件标题
 *        filename：文件名
 *        list：所属系列名称
 * @type {RegExp}
 */
let rmeta = /@(title|filename|list):\s*(.+)/g
let RELATIVE_PATH = '../'
let PATH_ARTICLE = RELATIVE_PATH + 'article/'
let PATH_TEMPLATE = RELATIVE_PATH + 'assets/template/'
let ENCODING = 'utf-8'

function parse(path) {
    let parseArticleFn

    readfile(PATH_TEMPLATE + 'article.ejs', ENCODING)
        .then(function (data) {
            parseArticleFn = ejs.compile(data)
            return readdir(path)
        })
        .then(function (files) {
            return generateHTML(files)
        })

    function generateHTML(files) {
        const filename = files.shift()
        if (!rfiletype.test(filename))
            return files.length ? generateHTML(files) : generateArticlesList()

        readfile(path + filename, ENCODING).then(function (data) {
            const metas = {}
            data = data.replace(rmeta, function (text, n, v) {
                metas[n] = v
                return ''
            })
            ;(listObj[metas.list] || (listObj[metas.list] = [])).push(metas)
            const html = parseArticleFn({
                title: metas.title,
                content: md.toHTML(data)
            })

            fs.writeFile(
                PATH_ARTICLE + metas.filename + '.html',
                html.replace(/<code>/g, '<code class="language-javascript">'),
                function () {
                    console.log(metas.filename + ' is ok!')
                    files.length ? generateHTML(files) : generateArticlesList()
                }
            )
        })
    }
}

function generateArticlesList() {
    readfile(PATH_TEMPLATE + 'article-index.ejs', ENCODING).then(function (data) {
        fs.writeFile(
            PATH_ARTICLE + 'index.html',
            ejs.compile(data)({
                list: listObj
            }),
            () => {}
        )
    })
}

/**
 * reverse a markdown file to HTML.
 * @param path
 */
function reverse(path) {
    htmlToMd = htmlToMd || require('to-markdown').toMarkdown
    fs.readdir(path, function (err, files) {
        convertHtmlToMarkdown(files)
    })
}

function convertHtmlToMarkdown(files) {
    const filename = files.shift()
    fs.readFile(
        PATH_ARTICLE + filename,
        {
            encoding: ENCODING
        },
        function (err, data) {
            fs.writeFile(
                '../build/' + filename.replace('html', 'md'),
                htmlToMd(data.replace(/<(\/)?pre>/g, '')),
                function () {
                    files.length && convertHtmlToMarkdown(files)
                }
            )
        }
    )
}

//reverse('../article/');
parse('../draft/')
