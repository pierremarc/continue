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

 
define(['underscore'], function(_){
    /*
     * In this first iteration, we go for message passing through events.
     * If it fails, we'll try delegated method calls, hm, sounds even better to 
     * begin with this idea.
     */
    var eproxy = function(){
//         console.log('eproxy', this.objects.length, this.pendings.length);
    };
    
    _.extend(eproxy.prototype, {
        /*
         * objects are registered once, makes sense  to keep them
         * as a protoype attribute.
         */
        objects: {},
        
        /*
         * arrays of pending calls of the form:
         * {objName, method, arguments, callback}
         */
        pendings: {
            calls:{},
            ons:{},
            offs:{},
        },
             
        processPendingCall: function(elt, idx, lst){
            var o = this.objects[elt.objName];
            var m = elt.method;
            var a = elt.arguments;
            var c = elt.callback;
            var ctx = elt.ctx;
            
            console.log('proxy.processPendingCall', elt.objName, m);
            
            if(!Array.isArray(a))
                a = [a];
            try
            {
                var ret = o[m].apply(o, a);
                if(c)
                {
                    c.apply(ctx, [ret]);
                }
            }
            catch(e)
            {
                console.error('processPendingCall:', o, m, e);
            }
        },
        
        processPendingOn:function(elt, idx, lst){
            var o = this.objects[elt.objName];
            var e = elt.event;
            var ctx = elt.context;
            var cb = elt.callback;
            
            o.on(e, cb, ctx);
        },
        
        /*
         * Register a named object for which you want to make
         * its methods available application wide.
         * 
         * note: at some point we can imagine to allow for a third argument to define available methods.
         * 
         */
        register: function(name, obj){
            if(!this.objects[name])
            {
                this.objects[name] = obj;
            }
            else
            {
                console.warn('eproxy.register: name already registered', name);
            }
            if(this.pendings.calls[name] && this.pendings.calls[name].length > 0)
            {
                // FIXME lock it to avoid concurrent processing
                _.each(this.pendings.calls[name], this.processPendingCall.bind(this))
                delete this.pendings.calls[name];
            }
            if(this.pendings.ons[name] && this.pendings.ons[name].length > 0)
            {
                _.each(this.pendings.ons[name], this.processPendingOn.bind(this));
                delete this.pendings.ons[name];
            }
        }, 
        
        /*
         * delegate a method call.
         * 
         * It doesn't return the method's return value because
         * the call might be deferred for later processing
         * if the name is not registered yet. Instead provide
         * a callback if you wish to get the returned value.
         *
         * @param name the name of the object on which the method needs to be called
         * @param method the method to be called
         * @param args the args that will be passed to the called methods
         * @param callback an optional callback that will be called with the method return value as argument
         * @param ctx the context to be used when call the method (and the callback)
         * 
         * @return {bool} true if the function has been applied immediately
         */
        delegate: function(name, method, args, callback, ctx){
            console.log('proxy.delegate', name, method);
            var a = args;
            if(!Array.isArray(a))
                a = [args];
            
            if(!this.objects[name])
            {
                console.log('proxy.delegate.pending', name, method);
                if(!this.pendings.calls[name])
                {
                    this.pendings.calls[name] = new Array;
                }
                this.pendings.calls[name].push({
                    objName: name,
                    method: method,
                    arguments: _.clone(args),
                    callback: callback,
                    ctx: ctx,
                });
                return false;
            }
            
            var o = this.objects[name];
            // try
            // {
                console.log('proxy.delegate.try', name, method);
                var ret = o[method].apply(o, a);
                if(callback)
                {
                    callback.apply(ctx, [ret]);
                }
            // }
            // catch(e)
            // {
                // console.error('eproxy.delegate:', name, method, e);
            // }
            return true;
        },
        
        
        /*
         * delegate positioning of event listeners
         */
        on:function(name, event, callback, context){
            if(!this.objects[name])
            {
                if(!this.pendings.ons[name])
                {
                    this.pendings.ons[name] = new Array;
                }
                this.pendings.ons[name].push({
                    objName: name,
                    event: event,
                    context: context,
                    callback: callback,
                });
                return;
            }
            var o = this.objects[name];
            o.on(event, callback, context);
        },
        off:function(name, event, callback, context){
            if(!this.objects[name])
            {
//                 TODO
                return;
            }
            var o = this.objects[name];
            o.off(event, callback, context);
        },
    });
    
    return (new eproxy);
});