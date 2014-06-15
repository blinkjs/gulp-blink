///<reference path="../node_modules/blink/blink.d.ts"/>
// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var blink = require('blink');

// Consts
var PLUGIN_NAME = 'gulp-blink';

// Plugin level function(dealing with files)
// ReSharper disable once UnusedLocals
function gulpBlink(options) {
    options = options || {};

    // Creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, callback) {
        var _this = this;
        var onBlinkResultCompiled = function (err, config, result) {
            if (err) {
                _this.emit('error', new PluginError(PLUGIN_NAME, err.message));
            }
            file.contents = new Buffer(result.contents);
            file.path = result.dest;
            _this.push(file);
            callback();
        };

        switch (true) {
            case file.isNull():
                break;

            case file.isStream():
                file.contents.path = file.path;
                blink.compileStream(options, file.contents, onBlinkResultCompiled);
                return;

            case file.isBuffer():
                blink.compileContents(options, {
                    src: file.path,
                    contents: file.contents.toString()
                }, onBlinkResultCompiled);
                return;

            default:
                this.emit('error', new PluginError(PLUGIN_NAME, 'Unexpected file type'));
                break;
        }

        this.push(file);
        callback();
    });

    // returning the file stream
    return stream;
}
;

module.exports = gulpBlink;
