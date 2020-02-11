var path = require('path');
var webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        editor: './build/client/scripts/editor.js',
        main: './build/client/scripts/main.js'
    },
    target: 'web',
    watch: false,

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './build/public/js')
    },

    module: {
        rules: [
            {
                test: /\.(js)?$/,
                include: path.resolve(__dirname, './build/client/scripts'),
                exclude: /node_modules/
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            { 
                test: /\.hbs/, 
                loader: 'handlebars-loader'
            },
        ]
    },

    resolve: {
        extensions: [".webpack.js", ".web.js", ".js"],
        alias: {
            client_templates: path.resolve(__dirname, './src/client/templates')
        }
    },

    externals: {
        "jquery": "jQuery"
    },

    plugins: [
        new CleanWebpackPlugin()
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(new UglifyJSPlugin());
}