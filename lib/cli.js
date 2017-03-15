#!/usr/bin/env node


debugger;

var fs = require('fs'),
    cc = require('config-chain'),
    beautify = require('../index'),
    mkdirp = require('mkdirp'),
    nopt = require('nopt');

var path = require('path'),
    knownOpts = {
        // Beautifier
        "indent_size": Number,
        "files": [path, Array],
        "outfile": path,
        "config": path
    },
    // dasherizeShorthands provides { "indent-size": ["--indent_size"] }
    shortHands = dasherizeShorthands({
        // Beautifier
        "s": ["--indent_size"],
    });


exports.interpret = function(argv, slice) {
    var parsed = nopt(knownOpts, shortHands, argv, slice);  //获取命令行参数
    var cfg;
    debugger;
    try {
        cfg = cc(
            parsed,
            parsed.config
        ).snapshot;
    } catch (ex) {
        console.error(ex);
        process.exit(1);
    }

    try {
        // Process files synchronously to avoid EMFILE error
        cfg.files.forEach(processInputSync, {
            cfg: cfg
        });
    } catch (ex) {
        console.error(ex);
        process.exit(1);
    }
};

// main iterator, {cfg} passed as thisArg of forEach call
//处理输入
function processInputSync(filepath) {
    var data = '',
        config = this.cfg,
        outfile = config.outfile,
        input;

    // -o passed with no value overwrites
    if (typeof outfile === 'undefined' || outfile === true || config.replace) {
        outfile = filepath;
    }

    data = fs.readFileSync(filepath, 'utf8');
    makePretty('js', data, config, outfile, writePretty);
}

function makePretty(fileType, code, config, outfile, callback) {
    try {
        var pretty = beautify[fileType](code, config);

        callback(null, pretty, outfile, config);
    } catch (ex) {
        callback(ex);
    }
}

function writePretty(err, pretty, outfile, config) {
    debugger;
    if (err) {
        console.error(err);
        process.exit(1);
    }

    if (outfile) {
        mkdirp.sync(path.dirname(outfile));

        try {
            fs.writeFileSync(outfile, pretty, 'utf8');
        } catch (ex) {
            if (err.code === 'EACCES') {
                console.error(err.path + " is not writable. Skipping!");
            } else {
                console.error(err);
                process.exit(0);
            }
        }
    } else {
        process.stdout.write(pretty);
    }
}

// "--foo_bar" 转成 "foo-bar"
function dasherizeFlag(str) {
    return str.replace(/^\-+/, '').replace(/_/g, '-');
}

//把值中含有_的，转成-，添加到key
function dasherizeShorthands(hash) {
    Object.keys(hash).forEach(function(key) {
        var val = hash[key][0];
        // 一个字母且包含下划线的val，才转成横线添加到key中
        if (key.length === 1 && val.indexOf('_') > -1) {
            hash[dasherizeFlag(val)] = val;
        }
    });

    return hash;
}

