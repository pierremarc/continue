/**
 *  Continue.js 0.1.0
 *
 *  Copyright (C) 2014 The continue Authors
 *  
 *  Continue may be freely distributed under the MIT license.
 *  
 *  For all details and documentation: https://github.com/pierremarc/continue
 *
 */ 

var modules = [
	"algo",
	"app",
	"collection",
	"config",
	"css",
	"draw",
	"eproxy",
	"geom",
	"keyboard",
	"live",
	"logger",
	"mixins",
	"positioning",
	"routers",
	"template",
	"types",
	"widgets",
];

/*
Yes, this is ugly to not use the 'modules' variable, but otherwise we've got an error at build time:

$ ./node_modules/.bin/r.js -o src/continue.build.src.js 

Tracing dependencies for: continue
Error: Error: Parse error using esprima for file: /home/pierre/System/src/continue/bin/continue.js
TypeError: Object #<Object> has no method 'concat'
    at /home/pierre/System/src/continue/node_modules/requirejs/bin/r.js:25449:47


*/

define('continue', 
[
	"algo",
	"app",
	"collection",
	"config",
	"css",
	"draw",
	"eproxy",
	"geom",
	"keyboard",
	"live",
	"logger",
	"mixins",
	"positioning",
	"routers",
	"template",
	"types",
	"widgets",
], function(){
	var main = {};
	for(var i = 0; i < modules.length; i++){
		var name = modules[i];
		main[name] = arguments[i];
	}
	return main;
});
