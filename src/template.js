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

define(["jquery", 'underscore', 'backbone', 'config'], 
function($, _, B, config) {
    'use strict';

    var T = {
        appsUrl: config.appsUrl,
        locale: config.locale,
        defaultLocale: config.defaultLocale,
        templateDir: config.templateDir,
        development: true,
        cache: {},
        waiting: {},
        loading:{},
       
        /*
        * Utility function to preprocess template names
        */
        name : function(name){
            var parts = name.split('/');
            var app = parts.shift();
            var path =  parts.join('/');
            var locale = this.locale || this.defaultLocale;
            return [app, this.templateDir, locale, path ].join('/');
        },
       
       url: function(name){
            return this.appsUrl 
                    + name
                    + '.html'
                    + (this.development ? '?q='+Math.random() : '');
        },
        
       /*
        * Rendering method
        * 
        * the way it works is to compile the template called @name
        * and then call the provided @callback with this compiled
        * template as argument in the context of @el. An optional 
        * @error callback can be passed that will be called if any
        * exception is raised in the process.
        */
        render: function(name, el, cb, error){
            var that = this;
            if(this.cache[name] === undefined)
            {
                if(this.waiting[name] === undefined)
                {
                    this.waiting[name] = [];
                }
                this.waiting[name].push({element:el, callback:cb});
                if(this.loading[name] === undefined)
                {
                    this.loading[name] = true;
                    $.get(that.url(name), function(html){
                        that.cache[name] = _.template(html, false, {variable:'data'});
                        for(var k = 0; k < that.waiting[name].length; k++)
                        {
                            var w = that.waiting[name][k];
                            w.callback.apply(w.element, [that.cache[name]]);
                            if (!w.element.__prevent_trigger__)
                                w.element.trigger('rendered');
                            // Disabled the catch-block to get more informative errors - GDH
                            // try{
                            //    w.callback.apply(w.element, [that.cache[name]]);
                            //    if (!w.element.__prevent_trigger__)
                            //       w.element.trigger('rendered');
                            // }
                            // catch(e)
                            // {
                            //     if(error && (typeof error === 'function'))
                            //     {
                            //         error(e);
                            //     }
                            //     else
                            //     {
                            //         console.error('Failed on template: '+name+' ['+e+']');
                            //     }
                            // }
                        }
                    });
                }
            }
            else
            {
                cb.apply(el, [that.cache[name]]);
                if (!el.__prevent_trigger__)
                    el.trigger('rendered');
                // Disabled the catch-block to get more informative errors - GDH
                // try{
                //    cb.apply(el, [that.cache[name]]);
                //    if (!el.__prevent_trigger__)
                //      el.trigger('rendered');
                // }
                // catch(e)
                // {
                //     if(error && (typeof error === 'function'))
                //     {
                //         error(e);
                //     }
                //     else
                //     {
                //         console.error('Failed on template: '+name+' ['+e+']');
                //     }
                // }
            }
        }
    };
    
    return T;
});