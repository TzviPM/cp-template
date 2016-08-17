#! /usr/bin/env node

var cpt = require('../lib');
var prog = require('commander');

prog
    .version('1.0.0')
    .arguments('<src> <dest> [fromStr] [toStr]')
    .action(function(src, dest, fromStr, toStr) {
        from = fromStr || '__TMPL__';
        to = toStr || function(str) {
            return str;
        };
        cpt(src, dest, from, to, function(err) {
            err && console.log(err);
        });
    })
    .parse(process.argv);