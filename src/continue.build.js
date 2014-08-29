({
    dir: "../bin",

    wrap: true,

    useStrict: false,

    paths: {
        "jquery": "empty:",
        'backbone': 'empty:',
        'underscore': 'empty:',
        'sockjs': 'empty:',
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
    },

    modules:[{
        name: 'continue',
        include:[
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
            ],
    }],

})

