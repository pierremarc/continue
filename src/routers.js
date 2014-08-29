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



define(["backbone", 'underscore', 'eproxy'], 
function( Backbone, _, P) {
    
    var setComponents = function(comps){
        var ca = comps.split(' ');
        P.delegate('app', 'setComponents', [ca]);
    };
    
    var addClass = function(r, klass){
        P.delegate(r, 'addClass', klass);
    };
    var removeClass = function(r, klass){
        P.delegate(r, 'removeClass', klass);
    };
    
    var main = Backbone.Router.extend({
        
        initialize:function(options){
            this._states = [];
        },

        /**
         * Create a route in the router
         *
         * @param route the router pattern
         * @param name the route name
         * @param callback
         * @returns {Router}
         */
        route: function(route, name, callback){
            console.log('router.route', route, name);
            return Backbone.Router.prototype.route.apply(this, [route, name, callback]);
        },
        
        navigate:function(route, options){
            options = _.extend({trigger: true}, options);
            this.resetClass(route);
            return Backbone.Router.prototype.navigate.apply(this, [route, options]);
        },
        
        reload:function(){
            var route = Backbone.history.fragment;
            Backbone.history.fragment = null;
            return Backbone.Router.prototype.navigate.apply(this, [route, {trigger: true}]);
        },
        
        back:function(){
            Backbone.history.history.back();
        },
        
        setClass:function(comp, klass){
            var s = {
                comp:comp,
                klass:klass,
            };
            this._states.push(s);
            addClass(comp, klass);
        },
        
        resetClass:function(route){
            _.each(this._states, function(s){
                removeClass(s.comp, s.klass);
            });
            this._states = [];
        },
        
        routes:{
            '': 'index',
//             'index': 'index',
        },
        
        index:function(){
            console.log('INDEX');
            setComponents('menu');
        },

    });
        
    
    return main;
});
