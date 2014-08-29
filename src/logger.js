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


define([], function(){
    
    // TODO please make it fancy - pm
    
    var _clog = console.log;
    console.log = function(){
        var e = '>>';
        var args = [e];
        for(var i=0; i< arguments.length;i++)
        {
            args.push(arguments[i]);
        }
        _clog.apply(console, args);
    };
    
    var logger = {
        log     : console.log,
        debug   : console.log,
        warning : console.warn,
        error   : console.error,
    };
    
    return logger;
});

