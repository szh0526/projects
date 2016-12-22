/**
 * webpack配置文件
 * webpack专注于js,css,html的预处理, gulp专注于任务流
 * webpack只有单一的入口index，其它的模块需要通过 import, require, url等导入
 * 模块和任务管理工具(前端工程化打包工具)
 * 打包工具
 * 模块加载工具
 * 各种资源都可以当成模块来处理
 * webpack 支持 commonJS/AMD/CMD
 * 替代部分 grunt/gulp 的工作，比如打包、压缩混淆、图片转base64等
 * 支持 React 热插拔（react-hot-loader）
 *
 * 前端工作流工具：Gulp，Grunt，Broccoli
 * 前端 Javascript 模块编译工具：Babel，Browserify，Webpack
 * 前端开发系列工具： livereload，数据 mock，代码监控，代码检查
 */
let webpack = require('webpack');
let path = require('path');
/*let HtmlwebpackPlugin = require('html-webpack-plugin');*/
let glob = require('glob');
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
const SERVER_PORT = 8089;

let config = {
    //配置生成Source Maps，使用eval打包源文件模块 适用开发阶段
    devtool: 'eval-source-map',
    /**
     * 默认带个入口文件,在页面启动时，会先执行入口文件js
     * 配置多个入口文件用数组['./src/index.js', './vendor/bootstrap.min.js'],
     */
    entry: {
        /*index: APP_PATH*/
        // 第三方包
        vendor: [
            'react',
            'react-dom'
        ]
    },
    /**
     * output为打包后生成的文件名及路径 合并以后的js会命名为bundle.js
     * 合理的缓存:使用缓存的最好方法是保证文件名和文件内容是匹配的（内容改变，名称相应改变）
     * webpack把哈希值加到打包文件名中格式（[name], [id] and [hash]）
     */
    output: {
        path: BUILD_PATH,
        filename: '[name].min.js' //'bundle.js' // "[name]-[hash].js"
    },
    /**
     * 建本地服务器(热启动,自动刷新浏览器)
     * 将在 localhost:8080 启动一个 express 静态资源 web 服务器，并且会以监听模式自动运行 webpack，
     * 在浏览器打开 http://localhost:8080/可以浏览项目中的页面和编译后的资源输出，
     * 并且通过一个 socket.io 服务实时监听它们的变化并自动刷新页面。
     * contentBase	默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）
     * port	设置默认监听端口，如果省略，默认为”8080“
     * inline	设置为 true ，当源文件改变时会自动刷新页面
     * colors	设置为 true ，使终端输出的文件为彩色的
     * historyApiFallback	在开发单页应用时非常有用，如果设置为 true ，所有的跳转将指向index.html
     */
    devServer: {
        contentBase: BUILD_PATH,
        historyApiFallback: false,
        colors: true,
        inline: true,
        port: SERVER_PORT,
        hot: true,
        progress: true
    },
    module: {
        /**
         * 模块和资源的转换器
         * loader处理各种资源使用对应的加载器处理
         * test ：一个匹配loaders所处理的文件的拓展名的正则表达式（必须）
         * loader ：loader的名称（必须）
         * include/exclude :手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
         * query ：为loaders提供额外的设置选项（可选）
         * loader 可以为string或数组["style", "css"] 或 style!css
         */
        loaders: [
                /**
                 * babel编译es6，react的jsx
                 * exclude来限定 npm 的禁用范围
                 * include来限定 babel 的使用范围，
                 * 提交到github时需要把babel模块排除掉
                 */
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel'
                        /*loader: 'babel-loader!jsx-loader?harmony'*/
                },
                /**
                 * 添加对样式表的处理
                 * 注：感叹号的作用在于使同一文件能够使用不同类型的loader
                 * css会和js打包到同一个文件中也可以打包到单独的css文件中
                 * modules相同的类名不会造成不同组件之间的污染，只对当前组件有效
                 */
                {
                    test: /\.css$/,
                    loader: 'style!css?modules!postcss',
                    include: APP_PATH
                },
                {
                    test: /\.json$/,
                    loader: "json"
                },
                //图片大小小于这个限制的时候，会自动启用base64编码图片
                {
                    /*test: /\.(png|jpg)$/,
                    loader: 'url?limit=40000'*/
                    test: /\.(gif|jpg|jpeg|png|woff|svg|eot|ttf)\??.*$/,
                    loader: 'url-loader?limit=40000&name=[path][name].[ext]'
                }
            ]
            /**
             * preloader 会在其他 loader 前应用
             */
            /*        ,preLoaders:[{
                        test: /\.js$/, 
                        loader: "eslint-loader", 
                        exclude: /node_modules/
                    }]*/
    },
    /**
     * PostCSS来为CSS代码自动添加适应不同浏览器的CSS前缀（hack）
     * 调用autoprefixer插件（自动添加前缀的插件）
     */
    postcss: [
        require('autoprefixer')
    ],
    /**
     * 用来拓展Webpack功能,会在整个构建过程中生效，执行相关的任务
     */
    plugins: [
            //合并压缩
            new webpack.optimize.UglifyJsPlugin({
                //去除console,debugger
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                },
                //防止命名空间冲突或覆盖
                mangle: {
                    except: ['$', 'exports', 'require']
                }
            })
            // 提取chunks文件中的公共代码到common.js中
            , new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.min.js')
            // 备案
            , new webpack.BannerPlugin('(招聘前端) => {QQ：340636803}')
            // 生成最终的Html5文件,自动引用了你打包后的JS文件
            /*        , new HtmlwebpackPlugin({
                        title: 'webpack-sample-project',
                        template: __dirname + "/src/html/index.tmpl.html"
                    })*/
            // 自动刷新和热加载
            , new webpack.HotModuleReplacementPlugin()
        ]
        /**
         * 检查lint Es6 和 jsx 的 javascript 
         */
        ,
    eslint: {
        //configFile: './.eslintrc'
    }
};

/**
 * 使用 glob 动态添加 entry入口index，让配置做到自动映射
 */
let files = glob.sync('./src/js/*/index.js');
let newEntries = files.reduce((memo, file) => {
    var name = /.*\/(.*?)\/index\.js/.exec(file)[1];
    memo[name] = entry(name);
    return memo;
}, {});

/**
 * Object.assign 合并对象
 */
config.entry = Object.assign({}, config.entry, newEntries);

/**
 * 获取入口文件
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function entry(name) {
    return './src/js/' + name + '/index.js';
}

/**
 * 作一个 node 模块 gulp调用
 */
module.exports = config;