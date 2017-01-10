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
 *
 * 常用webpack命令：
 * 在开发环境构建一次 webpack
 * 构建并生成源代码映射文件 webpack -d
 * 在生产环境构建，压缩、混淆代码，并移除无用代码 webpack -p
 * 快速增量构建，监听变动并自动打包 webpack –watch
 * progress 显示打包过程中的进度，colors打包信息带有颜色显示 webpack –progress –colors
 */
let webpack = require('webpack');
let path = require('path');
let HtmlwebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let glob = require('glob');
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
const SERVER_PORT = 8089;

let config = {
     /**
    * 配置生成Source Maps，上线后的devtool要配置为source-map
    * 生成map文件 vendor.min.js.map 方便调试
    * 启动：npm run sourcemap
    * 与HMR不能同时使用
    * 出错的时候，除错工具将直接显示原始代码，而不是转换后的代码
    */
    devtool: 'eval-source-map',
    /**
     * 默认带个入口文件,在页面启动时，会先执行入口文件js
     * 配置多个入口文件用数组['./src/index.js', './vendor/bootstrap.min.js']
     * 生成多个
     */
    entry: {
         'dll-user': ['./src/js/dll-user/index.js']
        /*index: APP_PATH*/
        // 第三方包 DLLPlugin 代替
        /*vendor: [
            'react',
            'react-dom'
        ]*/
    },
    /**
     * output为打包后生成的文件名及路径 合并以后的js会命名为bundle.js
     * 合理的缓存:使用缓存的最好方法是保证文件名和文件内容是匹配的（内容改变，名称相应改变）
     * webpack把哈希值加到打包文件名中格式（[name], [id] and [hash]）
     * webpack 产出文件的路径是拍平的，不能保留路径。
     * 可以通过一些方法保持原路径 (name 带路径) "home/index": './home/index.js',
     * entry: {
     *   'home/index': path.join('src/js/home/index.js'),
     *   'index/index': path.join('src/js/index/index.js')
     * },
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
     *
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
                 * es7语法分四个阶段分别对应四个插件 babel-preset-stage-0 1 2 3
                 */
                {
                    test: /\.js(x)*$/,
                    include: [
                        // 只去解析运行目录下的 src 文件夹
                        path.join(process.cwd(), './src')
                    ],
                    exclude:/node_modules/,
                    loader: 'babel'
                    /*loader: 'babel-loader!jsx-loader?harmony'*/
                },
                /**
                 * 添加对样式表的处理
                 * 注：感叹号的作用在于使同一文件能够使用不同类型的loader
                 * css会和js打包到同一个文件中也可以打包到单独的css文件中
                 * modules相同的类名不会造成不同组件之间的污染，只对当前组件有效
                 * 从右向左开始使用，less->转为css字符串->使用style将代码放到页面style标签中。
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
            //根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小
            new webpack.optimize.OccurenceOrderPlugin(),
            /**
            * 合并压缩混淆
            * 生产环境构建
            */
            new webpack.optimize.UglifyJsPlugin({
                //去除console,debugger
                compress: {
                    warnings: false,
                    drop_debugger: true,
                    drop_console: true
                },
                //可以在线上生成soucemap文件，便于调试，会导致编译过程变慢
                sourceMap: true,
                //防止命名空间冲突或覆盖
                mangle: {
                    except: ['$', 'exports', 'require']
                },
                minimize: true
            }),
            /**
            * 提取多个入口文件中的公共模块到vendor.min.js中
            * CommonsChunkPlugin 可以将相同的模块提取出来单独打包，进而减小 rebuild 时的性能消耗 如 ['home','index']
            * new webpack.optimize.CommonsChunkPlugin('vendor.min.js', ['home','index'])
            * new webpack.optimize.CommonsChunkPlugin("admin-commons.js", ["ap1", "ap2"]),
            * new webpack.optimize.CommonsChunkPlugin("commons.js", ["p1", "p2", "admin-commons.js"])
            */
            /*new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.min.js'),*/
            // 备案
            new webpack.BannerPlugin('(招聘前端) => {QQ：340636803}'),
            // 生成最终的Html5文件,自动引用了你打包后的JS文件
            new HtmlwebpackPlugin({
                title: 'webpack-sample-project',
                template: __dirname + "/src/html/index.html"
            }),
            //可以定义编译时的全局变量，有很多库（React, Vue等）会根据 NODE_ENV 这个变量来判断当前环境
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("development")  //production
                }
            }),
            /**
            * 自动刷新和热加载 动态的更新局部模块代码，而不需要刷新整个页面
            * 用sourcemap时不能使用HMR
            * 与dev-server的hot区别是：不用刷新页面，可用于生产环境
            * –progress 显示打包进度
            * –colors配置打包输出颜色显示
            * –hot热加载，代码修改完后自动刷新
            * –inline 是刷新后的代码自动注入到打包后的文件中(当源文件改变时会自动刷新页面)
            * -d 是debug模式，输入一个source-map，并且可以看到每一个打包的文件
            * -p 是对代码进行压缩
            */
            new webpack.HotModuleReplacementPlugin(),
            //跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。
            new webpack.NoErrorsPlugin(),
            //有些JS库有自己的依赖树，并且这些库可能有交叉的依赖，DedupePlugin打包的时候可以找出他们并删除重复的依赖。
            new webpack.optimize.DedupePlugin(),
            //引用之前打包好的dll文件，注意下context参数，这个应该根据manifest.json文件中的引用情况来赋值，如果引用的都是npm安装的库，这里就填项目根目录就好了。*/
            new webpack.DllReferencePlugin({
                context: ROOT_PATH,
                /**
                * 在这里引入 manifest 文件
                */
                manifest: require('./dist/vendor-manifest.json')
            }),
            //可以将所有css文件打包到独立css文件中
            new ExtractTextPlugin("css/[name]-[hash].css"),
            //合并请求 限制最大chunk数
            new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
            //合并请求 限制最小chunk数
            new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
        ],
    /**
    * 检查lint Es6 和 jsx 的 javascript
    */
    eslint: {
        //configFile: './.eslintrc'
    },
    /**
    * 文件解析配置
    * 会依次寻找不带后缀的文件，.js后缀文件以及.jsx后缀文件。
    */
    resolve: {
        //相对路径
        modulesDirectories: ['node_modules', './src'],
        //绝对路径
        /*root: path.resolve('node_modules'),*/
        //requrie的模块自动补全后缀
        extensions: ['', '.js', '.jsx'],
        //别名配置 import $ from 'test'
        /*alias: {
           //test:path.resolve(__dirname,'test.js'),
        }*/
    }
};

/**
 * 使用 glob 动态添加 entry入口index，让配置做到自动映射
 */
let files = glob.sync('./src/js/*/index.js');
let newEntries = files.reduce((memo, file) => {
    var name = /.*\/(.*?)\/index\.js/.exec(file)[1];
    console.log("chunk目录:" + file);
    memo[name] = entry(name);
    return memo;
}, {});

/**
 * Object.assign 合并对象
 */
/*config.entry = Object.assign({}, config.entry, newEntries);*/

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