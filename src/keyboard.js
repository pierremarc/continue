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


define([
    'underscore', 
    'jquery',
       ],
function(_, $){
    var keyboardCaptured = undefined;
    
    var kcodes = {
        8 : 'KEY_BACKSPACE',
        9 : 'KEY_TAB',
        13 : 'KEY_ENTER',
        16 : 'KEY_SHIFT',
        17 : 'KEY_CONTROL',
        20 : 'KEY_CAPS_LOCK',
        27 : 'KEY_ESCAPE',
        32 : 'KEY_SPACE',
        33 : 'KEY_PAGE_UP',
        34 : 'KEY_PAGE_DOWN',
        35 : 'KEY_END',
        36 : 'KEY_HOME',
        37 : 'KEY_LEFT',
        38 : 'KEY_UP',
        39 : 'KEY_RIGHT',
        40 : 'KEY_DOWN',
        45 : 'KEY_INSERT',
        46 : 'KEY_DELETE',
        106 : 'KEY_NUMPAD_MULTIPLY',
        107 : 'KEY_NUMPAD_ADD',
        108 : 'KEY_NUMPAD_ENTER',
        109 : 'KEY_NUMPAD_SUBTRACT',
        110 : 'KEY_NUMPAD_DECIMAL',
        111 : 'KEY_NUMPAD_DIVIDE',
        188 : 'KEY_COMMA',
        190 : 'KEY_PERIOD',
    };
    
    var kbdHandler = function(options){
        this.setupHandlers(options.events, 
                            options.element, 
                            options.context);
    };
    
    var proto = {
        dispatchEvents:function(evt){
            var k = kcodes[evt.which];
            if(k in this.handlers){
                this.handlers[k].apply(this.context, [evt]);
            }
        },
    
        setupHandlers: function(events, $el, ctx){
            this.resetHandlers();
            
            this.handlers = events;
            this.context = ctx;
            if(!$el.attr('id')){
                $el.attr('id', new Date().getTime());
            }
            selector = '#' + $el.attr('id');
            selector = '*';
            console.log('binding keyboard');
            $('body').on('keyup', this.dispatchEvents.bind(this));
            
        },
    
        resetHandlers: function(){
            this.end();
            this.handlers = {};
        },
    
        end: function(){
            console.log('UNbinding keyboard');
            $('body').off('keyup');
        },
    };
    
    _.extend(kbdHandler.prototype, proto);
    _.extend(kcodes, {handler:kbdHandler});
    
    return kcodes;
});