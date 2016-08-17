// imported from ncp (this is temporary, will rewrite)

var fs = require('fs-extra');
var stat = fs.lstat;
var path = require('path');
var replaceStream = require('replacestream');

function ncp (src, dest, oldStr, newStr, callback) {
    var basePath = process.cwd();
    var currentPath = path.resolve(basePath, src);

    // apply transform to destination
    // dest.replace(oldStr, newStr);

    var targetPath = path.resolve(basePath, dest);

    startCopy(currentPath, callback);

    function startCopy (source, then) {
        return getStats(source, then)
    }

    function nameReplace(name) {
        name = name.replace(currentPath, targetPath); // set output folder
        name = path.join(
            path.dirname(name), // leave dirname in case we're making a subtemplate
            path.basename(name).replace(oldStr, newStr)
        );
        return name;
    }

    function getStats (source, then) {
        stat(source, function (err, stats) {
            if (err) return then(err);

            // We need to get the mode from the stats object and preserve it.
            var item = {
                name: source,
                mode: stats.mode,
                stats: stats // temporary
            };

            if (stats.isDirectory()) {
                return onDir(item, then)
            } else if (stats.isFile() || stats.isCharacterDevice() || stats.isBlockDevice()) {
                return onFile(item, then)
            } else if (stats.isSymbolicLink()) {
                // Symlinks don't really need to know about the mode.
                return onLink(source, then)
            }
        });
    }

    function onFile (file, then) {
        var target = nameReplace(file.name);
        isWritable(target, function (writable) {
            if (writable) {
                copyFile(file, target, then)
            } else {
                then(new Error("file '" + target + "' is not writable."));
            }
        })
    }

    function copyFile (file, target, then) {
        var readStream = fs.createReadStream(file.name);
        var writeStream = fs.createWriteStream(target, { mode: file.mode });

        readStream.on('error', then);
        writeStream.on('error', then);

        writeStream.on('open', function () {
            readStream
                .pipe(replaceStream(oldStr, newStr)) // apply transform to file
                .pipe(writeStream)
        });

        writeStream.once('finish', function () {
            fs.chmod(target, file.mode, function (err) {
                if (err)
                    return then(err);
                then();
            })
        })
    }

    function onDir (dir, then) {
        var target = nameReplace(dir.name);
        isWritable(target, function (writable) {
            if (writable) {
                return mkDir(dir, target, then);
            }
            copyDir(dir.name, then);
        })
    }

    function mkDir (dir, target, then) {
        fs.mkdir(target, dir.mode, function (err) {
            if (err) return then(err);
            // despite setting mode in fs.mkdir doesn't seem to work
            // so we set it here.
            fs.chmod(target, dir.mode, function (err) {
                if (err) return then(err);
                copyDir(dir.name, then)
            })
        })
    }

    // argument 'then' will be called only when entire dir
    // is coppied, or upon error
    function copyDir (dir, then) {
        fs.readdir(dir, function (err, items) {
            if (err) return then(err);

            var toDo = items.length;
            errors = [];
            afterCopy = function(err) {
                if(err) {
                    if(err.constructor === Array)
                        errors.concat(err);
                    else
                        errors.push(err);
                }
                toDo -= 1;
                if(toDo == 0) {
                    if(errors.length)
                        then(errors);
                    else
                        then(null);
                }
            };
            items.forEach(function (item) {
                // apply transform to new file names:
                // item = item.replace(oldStr, newStr);
                startCopy(path.join(dir, item), afterCopy);
            });
        })
    }

    function onLink (link, then) {
        var target = nameReplace(link);
        fs.readlink(link, function (err, resolvedPath) {
            if (err) return then(err);
            checkLink(resolvedPath, target, then);
        })
    }

    function checkLink (resolvedPath, target, then) {
        isWritable(target, function (writable) {
            if (writable) {
                return makeLink(resolvedPath, target, then)
            }
            then(new Error("link '" + target + "' is not writable."));
        })
    }

    function makeLink (linkPath, target, then) {
        fs.symlink(linkPath, target, function (err) {
            then(err);
        })
    }

    function isWritable (path, done) {
        fs.lstat(path, function (err) {
            if (err) {
                if (err.code === 'ENOENT') return done(true);
                return done(false);
            }
            return done(false);
        });
    }
}

module.exports = ncp;
