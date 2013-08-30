/*
    my site's build system.
*/

var fs = require('fs'),
    uglify = require('uglify-js'),
    ejs = require('ejs'),
    md5 = require('md5'),
    config,
    files,
    md5s,
    len;

function init() {
    config = JSON.parse(fs.readFileSync('config.json', {
        encoding: "utf-8"
    }));

    md5s = config.md5.articles;

    //reset delimiter
    ejs.open = '{{';
    ejs.close = '}}';

    compressResources();
    //compileArticles();
}

/*
    return true, means file's content hadn't change.
*/
function checkFileMD5(obj, name, content) {
    var md5String = md5.digest_s(content),
        current = obj[name];
    if(!current || current != md5String) {
        obj[name] = md5String;
        return false;
    }
    return true;
}

function clipFile(filename, fileContent) {
    var rtitle = /\<title\>(.+)\<\/title\>/,
        rcontent = /\<body\>/m,
        title,
        content,
        match = fileContent.match(rtitle);
    if(match.length == 2) {
        title = match[1];
        content = fileContent.replace(rcontent, '');
    } else {
        throw new Exception(filename + " doesn't have a title!");
        return;
    }
    return {
        title: title,
        content: content
    }
}

function compressResources() {
    var js = config.js,
        style = config.style,
        jsMD5 = config.md5.js,
        styleMD5 = config.md5.style,
        files;
    fs.readdir(js, function(err, files) {
        if(files && files.length > 0) {
            var file,
                content,
                len = files.length,
                result;
            while(len--) {
                file = files[len];
                if(file.indexOf('-min.js') != -1) return;
                content = fs.readFileSync(js + file) + '';
                if(!checkFileMD5(jsMD5, file, content)) {
                    result = uglify.minify(js + file);
                    fs.writeFileSync(js + file.replace('.js', '-min.js'), result.code);
                }
            }
        }
    });
}

function compileArticles() {
    var filename,
        fileContent,
        result;
    //read source files
    files = fs.readdirSync(config.source);
    if(!(len = files.length)) return;
    console.log('There are ' + len + ' article' + (len > 1 ? 's' : '') + ' to be compiled...')
    for(var i = 0; i < len; i++) {
        filename = files[i];
        content = fs.readFileSync(config.source + '\\' + filename) + '';
        /*if(!checkFileMD5(filename, content)) {
            result = clipFile(filename, content);
            console.log(result.content)
        }*/
    }
}

init();

return;