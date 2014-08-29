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

 
define([],
function () {
    /**
    * Mixin for the view to 'overlay'
    */
    var Overlay = {
        /**
        * Reveals overlay. If a callback is provided the movement is animated
        */
        reveal: function(callback, ctx) {
            if (this.__overlayState == 'hidden') {
                this.__overlayState = 'visible';
                this.translate(0, -500).transition(callback, ctx);
            }
        },

        /**
        * Hides the overlay. If a callback is provided it will be animated
        */
        hide: function(callback, ctx) {
            if(!this.__overlayState) this.__overlayState = 'visible';
            if (this.__overlayState == 'visible') {
                this.__overlayState = 'hidden';
                this.translate(0, 500).transition(callback, ctx);
            }
        },
    };
    
    /**
    * Mixin for the containerView of the overlay
    */
    var OverlayHandler = {
        /**
        * Opens the given view as an overlay, but also closes the vurrent, if any.
        */
        showOverlay: function (overlay, anchor, callback, ctx) {
            this.attachToAnchor(overlay, anchor);
            overlay.hide();
            // Hide old
            this.hideOverlay(this.noop);
            // Reveal new
            this._currentOverlay = overlay;
            overlay.reveal(this.noop);
        },

        /**
        * Closes the active overlay, if there is one
        */
        hideOverlay: function (callback, ctx) {
            if(this._currentOverlay)  {
                var overlay = this._currentOverlay;
                // If a callback was provided we wrap it in a function
                // wich will remove the overlay when the animation is 
                // completed
                if (callback) {
                    var oldCallback = callback;
                    callback = function () {
                        oldCallback.apply(ctx, arguments);
                        overlay.$el.detach();
                    }
                }
                overlay.hide(callback, ctx);
                // If no callback was provided  we remove it 
                // immediately, as no callback means no 
                // animation
                if (!callback)
                   overlay.$el.detach();
                this._currentOverlay = undefined;
            }
        },

        /**
        * Actually also removes the currently active overlay.
        */
        removeOverlay: function (callback, ctx) {
            if (this._currentOverlay) {
                var overlay = this._currentOverlay;
                if (callback) {
                    var oldCallback = callback;
                    callback = function () {
                        oldCallback.apply(ctx, arguments);
                        overlay.remove();
                    }
                }
                this.hideOverlay(callback, ctx);
                if (!callback)
                    overlay.remove();
            }
        },
    };

    var Positionable = {
        span: 1,
        positionable: false,
        positioned: false,
        /**
        * Returns the amount of cols the element as
        * to span. Returns actually this.span, to 
        * ease overriding the function
        */
        getSpan: function () {
            return this.span;
        },

        /**
        * Convenience for a positioned Subview
        */
        markPositionable: function () {
            this.positionable = true;
            this.trigger('positionable');
        },

        /**
        * Sets the size of the elemen
        */
        setSize: function(columnWidth, gutter) {
            var span = this.getSpan();
            var width = columnWidth * span + ((span - 1) * gutter);
            this.$el.css('width', width);
        },            
    };

    var SideStackElement = {
        reveal: function () {
            this.removeClass('stacked');
            this.addClass('revealed');
        },

        stack: function () {
            this.removeClass('revealed');
            this.addClass('stacked');
        },
    };

    /**
    * Attempt to turn the Sidestack positioning into
    * a mixin
    */
    var SideStack = {
        /**
        * Reveals given subview with animation, activates it
        * and hides and deactivates current subview
        *
        * @param 
        */ 
        reveal: function (subview) {
            console.log(subview);

            if (this.current) {
                this.current.stack();
                this._stack(this.current).transition(this.noop);
            }

            this.current = subview;
            subview.reveal();
            this._reveal(subview).transition(this.noop);
        },

        /**
        * Stacks given subview, without animation
        */
        stack: function (subview) {
            this._stack(subview).transition();
        },

        
        /**
        * Prepares the transformation stack of the given subview with
        * a translation to reveal the container from the stack
        *
        * @param subview {View}
        * @returns subview {View}
        */
        _reveal: function (subview) {
            return subview.translate(this.anchors[this.subviewContainer].left() - subview.left(), 0);
        },

        /**
        * Prepares the transformation stack of the given subview with
        * a translation to move the container to the stack
        *
        * @param subview {View}
        * @returns subview {View}
        */
        _stack: function (subview) {
            return subview.translate(this.anchors[this.subviewContainer].right() - subview.left(), 0);
        },
    };

    return ({
        Overlay: Overlay,
        OverlayHandler: OverlayHandler,
        Positionable: Positionable,
        SideStack: SideStack,
        SideStackElement: SideStackElement,
    });
});   