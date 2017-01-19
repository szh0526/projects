/**
 * Created by sunzehao on 2016/12/9.
 * webpack生产环境配置
 * 发布生产环境之前，运行任务，包括压缩、混淆、内联化CSS、延迟加载script等
 * 小结
 * 确定不会在生产环境打包多余的代码, 比如 热加载 只是举个例子
 * 检查只在 dev 使用的配置,在生产环境将其去掉. 可使用配置文件，灵活配置，灵活切换
 * 去除所有注释, 压缩所有可压缩的资源文件.
 * 开启 gzip压缩.
 */
let HtmlWebpackPlugin = require('html-webpack-plugin')
    ,ExtractTextPlugin = require("extract-text-webpack-plugin")
    ,CompressionWebpackPlugin = require('compression-webpack-plugin')
    ,webpack = require('webpack')
    ,fs = require('fs')
    ,path = require('path')
    ,glob = require('glob');
const ROOT_PATH = path.resolve(__dirname)
    ,APP_PATH = path.resolve(ROOT_PATH, 'src')
    ,BUILD_PATH = path.resolve(ROOT_PATH, 'bin')
    ,DLL_PATH = path.join(ROOT_PATH, '/bin/src/common/dll');

let config = {
    entry: {
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js(x)*$/,
                include: [
                    path.join(process.cwd(), './src')
                ],
                exclude:/node_modules/,
                loader: 'babel?compact=false'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
            },
            {
                test: /\.json$/,
                loader: "json"
            },
            {
                test: /\.(gif|jpg|jpeg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=40000&name=[path][name].[ext]'
            }
        ]
    },
    postcss: [
        require('autoprefixer')
    ],
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            sourceMap: true,
            mangle: {
                except: ['$', 'exports', 'require']
            },
            minimize: true
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.DllReferencePlugin({
            context: ROOT_PATH,
            manifest: require(path.join(DLL_PATH + '/vendor-manifest.json'))
        }),
        new ExtractTextPlugin("[name].css"),
        new CompressionWebpackPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
        new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
    ],
    resolve: {
        modulesDirectories: ['node_modules', './src'],
        extensions: ['', '.js', '.jsx', '.json', '.css', '.less' , '.sass']
    }
};

let entryFiles = glob.sync('./src/**/*.entry.js');
let newEntries = entryFiles.reduce((memo, filePath) => {
    let key = filePath.substring(filePath.lastIndexOf(path.sep),filePath.lastIndexOf('.'));
    console.log("chunk:" + key + " &&&&& file:" + filePath);
    memo[key] = path.join(ROOT_PATH,filePath);
    return memo;
}, {});

let htmlWebpackPlugins = entryFiles.map((filePath) => {
    if(filePath.indexOf('common')  > -1) return;
    let name = filePath.substring(filePath.lastIndexOf("/") + 1,filePath.length - 9);
    let chunks = [
        './src/common/kit/util.entry'
        ,filePath.substring(0,filePath.lastIndexOf("."))
    ]
    console.log("HtmlWebpackPlugin:" + name + " &&&&& file:" + filePath);
    let htmlWebpackPlugin = new HtmlWebpackPlugin({
        title:name,
        filename: `./${name}.html`,
        template: `./src/${name}/${name}.html`,
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        hash: true,
        chunks: chunks
    });
    config.plugins.push(htmlWebpackPlugin);
    return htmlWebpackPlugin;
});

config.entry = Object.assign({}, config.entry, newEntries);

module.exports = config;