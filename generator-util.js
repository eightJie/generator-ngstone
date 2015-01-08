'use strict';
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function rewrite(args) {
    /* jshint -W044 */
    // check if splicable is already in the body text
    var re = new RegExp(args.splicable.map(function (line) {
        return '\s*' + escapeRegExp(line);
    }).join('\n'));

    if (re.test(args.haystack)) {
        return args.haystack;
    }

    var lines = args.haystack.split('\n');

    var otherwiseLineIndex = 0;
    lines.forEach(function (line, i) {
        if (line.indexOf(args.needle) !== -1) {
            otherwiseLineIndex = i;
        }
    });

    var spaces = 0;
    while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
        spaces += 1;
    }

    var spaceStr = '';
    while ((spaces -= 1) >= 0) {
        spaceStr += ' ';
    }

    lines.splice(otherwiseLineIndex, 0, args.splicable.map(function (line) {
        return spaceStr + line;
    }).join('\n'));

    return lines.join('\n');
}

function rewriteFile(args) {
    args.path = args.path || process.cwd();
    var fullPath = path.join(args.path, args.file);

    args.haystack = fs.readFileSync(fullPath, 'utf8');
    var body = rewrite(args);

    fs.writeFileSync(fullPath, body);
}

function addAppNameSuffix(appname) {
    return appname + 'App';
}
function addScriptSuffix(scriptName) {
    return scriptName + '.js';
}

function removeDirRecursiveSync(itemPath) {
    if (fs.statSync(itemPath).isDirectory()) {
        var fileList = fs.readdirSync(itemPath);
        fileList.forEach(function(childItemName) {
            removeDirRecursiveSync(path.join(itemPath, childItemName));
        })
        fs.rmdirSync(itemPath);
    } else {
        fs.unlinkSync(itemPath);
    }
}
function clearDir(path) {
    if( !fs.existsSync(path) ) {
        return;
    }
    var files = fs.readdirSync(path);
    files.forEach(removeDirRecursiveSync);
};

function readFiles(directory,handler,context) {
    var files = fs.readdirSync(directory);
    files.forEach(function (f) {
        if(fs.statSync(f).isDirectory()){
            return;
        }
        handler.call(context,f);
    })
}
module.exports = {
    rewrite: rewrite,
    rewriteFile: rewriteFile,
    addAppNameSuffix:addAppNameSuffix,
    addScriptSuffix:addScriptSuffix,
    clearDir:clearDir,
    readFiles:readFiles
};
