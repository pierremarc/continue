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
    'logger',
    "underscore",
    "backbone", 
    "jquery", 
    "config", 
    'eproxy',
       ],
function(log, _, Backbone, $, config, P) {
    
    var App = Backbone.View.extend({
        id:'container',
        
        permanentComps:{},
        components:{},
        
        // TODO create layouts on the fly
        setupLayout:function(){
            this.layouts = {
                header:$('<div />'),
                viewport:$('<div />'),
                footer:$('<div />'),
            };
            
            for(var l in this.layouts)
            {
                this.layouts[l].attr('id',l).appendTo(this.el);
            }
            this.$el.appendTo($('body'));
        },
        
        registerComponent: function(name, view, layout, permanent){
            var comp = {
                view:view,
                visible:false,
                rendered: false,
                layout: layout || 'viewport',
            };
            
            if(permanent){
                this.permanentComps[name] = comp;
            }
            else{
                this.components[name] = comp;
            }
            
            P.register(name, view);
            if(name in this.pendingComponents){
                this.pendingComponents = _.omit(this.pendingComponents, name);
                this.setComponents(this.current_comps);
            }
            
        },
        
        send:function(comp, method, args){
            if(!Array.isArray(args))
                args = [args];
            var view = this.getComponent(comp);
            var vm = view[method];
            if(view 
                && vm 
                && (typeof vm === 'function'))
            {
                vm.apply(view, args);
            }
        },
        
        getComponent:function(comp){
            if(this.components[comp] === undefined)
                return null;
            return this.components[comp].view;
        },
        
        renderComponent: function(c, k){
            console.log('app.renderComponent', k);
            this.layouts[c.layout].append(c.view.el);
            if(!c.rendered)
            {
                c.view.render();
                c.rendered = true;

                this.listenToOnce(c.view, 'rendered', _.partial(this.activate, c));
            } else {
                // Component is already renderd so we invoke
                // activate immediately 
                this.activate(c);
            }
        },

        activate: function (c) {
            if (c.view.activate)
                c.view.activate();
        },
        
        render:function(){
            
            _.each(this.components, function(c, k){
                if(c.visible)
                {
                    this.renderComponent(c, k);
                }
            }, this);
            
            _.each(this.permanentComps, function(c, k){
                this.renderComponent(c, k);
            }, this);
            
            return this;
        },
        resetViews:function(comps){
            for(var i=0; i<comps.length; i++)
            {
                var c = comps[i];
                try{
                    this.components[c].rendered = false;
                }
                catch(e){
                    //                     console.log('Could not reset: '+c);
                }
            }
            this.render();
        },
        setComponents:function(comps){
            for(var k in this.components){
                var c = this.components[k];
                if(c.visible && c.view.deactivate)
                {
                    c.view.deactivate();
                }
                c.visible = false;
                c.view.$el.detach();
            }
            this.current_comps = comps;
            
            for(var i=0; i < comps.length; i++)
            {
                var c = comps[i];
                try{
                    this.components[c].visible = true;
                }
                catch(e){
                    console.log('Could not activate: '+c, e);
                    this.pendingComponents[c] = e;
                }
            }
            return this.render();
        },
        unsetComponent:function(comp){
            this.current_comps = _.without(this.current_comps, comp);
            var c = this.components[comp];
            if(c.visible && c.view.deactivate)
            {
                c.view.deactivate();
            }
            c.visible = false;
            c.view.$el.detach();
        },
        
        setComponent:function(comp){
            this.current_comps = _.union(this.current_comps, [comp]);
            var c = this.components[comp];
            c.visible = true;
            this.renderComponent(c);
        },
        
        
        /*******************
         *  app specific
         * *****************/
        
        initialize:function(){
            this.pendingComponents = {};
            this.setupLayout();
        },
        
        start:function(){
            var self = this;
            self.trigger('ready');        
        },

    });
    
    var app = undefined;
    var getApp = function(name){
        name = name || 'app';
        if(!app)
        {
            app = new App;
            P.register(name, app);
        }
        return app;
    };
    return getApp;
});