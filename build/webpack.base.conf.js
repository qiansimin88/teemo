var webpack = require("webpack");
var path = require('path')
var projectRoot = path.resolve(__dirname, '../')
var autoprefixer = require('autoprefixer');
var project = require('../server/project');
if (!project.host) project.host = "";

module.exports = {
    entry: {
        app: './main.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist/statics'),
        publicPath: project.host + '/statics/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'views': path.resolve(__dirname, '../views'),
            'phoenixUI': path.resolve(__dirname, '../node_modules/phoenixUI/src/components/'),
            'teemo': path.resolve(__dirname, '../../phoenix-teemo/packages/')
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        preLoaders: [
            {
                test: /\.vue$/,
                loader: 'eslint',
                include: projectRoot,
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'eslint',
                include: projectRoot,
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.html$/,
                loader: 'vue-html'
            },
            {
                test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name].[ext]?[hash:7]'
                }
            },
            {
                test: /\.less$/,
                loader: 'style!css!less',
                include: projectRoot,
                exclude: /node_modules/
            }
        ]
    },
    eslint: {
        formatter: require('eslint-friendly-formatter')
    },
    vue: {
        autoprefixer: {
            browsers: ['> 1%', 'iOS 7', 'iOS 8', 'ie > 8']
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new webpack.DefinePlugin({
            "process.env": {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'CDN': JSON.stringify(project.cdn_host),
                'HOST': JSON.stringify(project.host),
                'STATIC_CDN': JSON.stringify(project.static_cdn_host)
            }
        })
    ]
}