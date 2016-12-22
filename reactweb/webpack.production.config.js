/**
 * Created by sunzehao on 2016/12/9.
 * webpack生产环境配置
 * 发布生产环境之前，运行任务，包括压缩、混淆、内联化CSS、延迟加载script等
 * package.json添加配置
 * "scripts": {
 *   "start": "webpack-dev-server --progress",
 *   "build": "NODE_ENV=production webpack --config ./webpack.production.config.js --progress"
 * },
 */
var webpack = require('webpack');
var path = require("path");
var HtmlwebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'app');
const BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
    entry: APP_PATH,
    output: {
        path: BUILD_PATH,
        filename: "[name]-[hash].js"
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: "json"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.(gif|jpg|jpeg|png|woff|svg|eot|ttf)\??.*$/
                ,loader: 'url-loader?limit=40000&name=[path][name].[ext]'
            },
            {
                test: /\.css$/,
                loader: 'style!css?modules!postcss'
            }
        ]
    },
    postcss: [
        require('autoprefixer')
    ],
    /**
     * OccurenceOrder 和 UglifyJS plugins 都是内置插件
     * OccurenceOrderPlugin :为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
     * UglifyJsPlugin：压缩JS代码
     * ExtractTextPlugin：分离CSS和JS文件
     */
    plugins: [
        new HtmlwebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("[name]-[hash].css")
    ]
}