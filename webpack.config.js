var path = require('path');
var webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './build/client/scripts/editor.js',
    target: 'web',
    watch: false,

    output: {
        filename: 'editor.js',
        path: path.resolve(__dirname, './build/public/js')
    },

    module: {
        rules: [{
            test: /\.(js)?$/,
            include: path.resolve(__dirname, './build/client/scripts'),
            exclude: /node_modules/
        },
        {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        }]
    },

    resolve: {
        extensions: [".webpack.js", ".web.js", ".js"]
    },

    externals: {
        "jquery": "jQuery",
        "handlebars": "Handlebars"
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'Handlebars': 'handlebars'
        })
    ]
};