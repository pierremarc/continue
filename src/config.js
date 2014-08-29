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


define(['underscore','jquery', 'backbone'],
function(_, $, Backbone){
    
    var Config = function(config_url){
        this.url = config_url;
    };
    
    _.extend(Config.prototype, {
        _config : {},
        isReady : function(){
            return this.ready;
        },
        
        preLoad: function(keys){
            if('string' === typeof keys){
                keys = [keys];
            }
            var self = this;
            var triggerReady = function(){
                this.trigger('configured');
            };
            var afterReady = _.after(keys.length, triggerReady.bind(this)) 
            _.each(keys, function(key){
                $.getJSON(self.url + key, function(data){
                    var pickedData = _.pick(data, key);
                    _.extend(self._config, pickedData);
                    afterReady();
                });
            });
        },
        
        get : function(key, callback, ctx){
            if(key in this._config){
                if(callback){
                    callback.apply(ctx, [_.pick(this._config, key)]);
                }
                return this;
            }
            var self = this;
            $.getJSON(self.url + key, function(data){
                var pickedData = _.pick(data, key);
                if(callback){
                    callback.apply(ctx, [pickedData]);
                }
                _.extend(self._config, pickedData);
            });
            return this;
        },
    });
    
    return function(url){return new Config(url);};
});

