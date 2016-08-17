var fs = require('fs-extra');
var path = require('path');
var ncp = require('./ncp-template');

function cp (src, dest, oldStr, newStr, callback) {
    callback = callback || function () {};

    // don't allow src and dest to be the same
    var basePath = process.cwd();
    var currentPath = path.resolve(basePath, src);
    var targetPath = path.resolve(basePath, dest);
    if (currentPath === targetPath) return callback(new Error('Source and destination must not be the same.'));

    fs.lstat(src, function (err, stats) {
        if (err) return callback(err);

        var dir = null;
        if (stats.isDirectory()) {
            var parts = dest.split(path.sep);
            parts.pop();
            dir = parts.join(path.sep)
        } else {
            dir = path.dirname(dest)
        }

        fs.exists(dir, function (dirExists) {
            if (dirExists) return ncp(src, dest, oldStr, newStr, callback);
            fs.mkdirs(dir, function (err) {
                if (err) return callback(err);
                ncp(src, dest, oldStr, newStr, callback)
            })
        })
    })
}

module.exports = cp;