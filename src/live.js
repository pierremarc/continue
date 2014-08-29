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


define(['underscore', 'sockjs', 'logger', 'config'], 
function(_, S, log, config){
    
    'use strict';

    var Live = function(){
        log.debug('live.constructor');
        this._inited = false;
        this.subscribers = [];
        this._pendings = [];
    };
    
    _.extend(Live.prototype, {
        
        connect: function(token){
            log.debug('live.connect');
            this._token = token;
            this._connection = new S(config.liveUrl),
            this._connection.onmessage = this._handleMessage.bind(this);
            this._connection.onopen = this.bootstrap.bind(this);
            this._inited = true;
        },
        
        bootstrap: function(){
            log.debug('live.bootstrap');
            var self = this;
            this._connection.send(JSON.stringify(this._token));
            _.each(this._pendings, function(p){
                self.subscribe(p.channel, p.callback, p.ctx);
            });
            this._pendings = [];
        },
        
        _handleMessage: function(e){
            log.debug('live._handleMessage', e);
            var data = JSON.parse(e.data);
            if(data.channel)
            {
                var rec = _.where(this.subscribers, {channel:data.channel});
                _.each(rec, function(o){
                    o.callback.apply(o.ctx, [data]);
                });
            }
        },
        
        subscribe:function(channel, callback, ctx){
            log.debug('live.subscribe', channel);
            
            var subscriber = {
                channel:channel,
                callback:callback,
                ctx:ctx,
            };
            
            if(this._inited 
                && this._connection.readyState === S.OPEN)
            {
                this._connection.send(JSON.stringify({channel:channel}));
                this.subscribers.push(subscriber);
                return this.subscribers.length;
            }
            
            this._pendings.push(subscriber);
            return this._pendings.length;
            
        },
        
    });
    
    var live = new Live;
    return live;
});