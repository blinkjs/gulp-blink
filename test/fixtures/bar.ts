///<reference path="../../node_modules/blink/blink.d.ts"/>
import blink = require('blink');

var rule = new blink.Rule('.bar', {
	baz: 'qux'
});

export = rule;
