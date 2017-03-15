/**
 * webpack配置文件
 * webpack专注于js,css,html的预处理, gulp专注于任务流
 * 模块和任务管理工具(前端工程化打包工具)
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
 * 确定不会在生产环境打包多余的代码, 比如 热加载 去除所有注释, 压缩所有可压缩的资源文件. 开启 gzip压缩.
 */
let HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    webpack = require('webpack'),
    SpritesmithPlugin = require('webpack-spritesmith'),
    fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    staticCfg = require('./config');

let config = {
    /**
     * 配置生成Source Maps，上线后的devtool要配置为source-map
     * 生成map文件 vendor.min.js.map 方便调试
     * 启动：npm run sourcemap
     * 与HMR不能同时使用
     * 出错的时候，除错工具将直接显示原始代码，而不是转换后的代码
     * 开发过程中用 devtool 会导致打包后文件大小非常大
     * 建议在production环境打包的时候关闭 devtool
     */
    /*devtool: 'eval-source-map',*/
    entry: {},
    /**
     * output为打包后生成的文件名及路径 合并以后的js会命名为bundle.js
     * 合理的缓存:使用缓存的最好方法是保证文件名和文件内容是匹配的（内容改变，名称相应改变）
     * webpack把哈希值加到打包文件名中格式（[name], [id] and [hash]）
     * webpack 产出文件的路径是拍平的，不能保留路径。
     * 可以通过一些方法保持原路径 (name 带路径) "home/index": './home/index.js',
     * path: 静态资源打包文件生成的绝对路径
     * publicPath: 设定以http请求的方式请求静态资源的路径，对服务器、cdn等静态资源的请求路径。
     * 模拟CDN http://cdn.example.com/bin/ 为webpack插件提供路径
     * 如：css:background-image: url('https://someCDN/test.png'); html:http://localhost:8089/js/common/kit/util.entry.min.js?f4a506159215cc107849
     * entry: {
     *   'home/index': path.join('src/js/home/index.js'),
     *   'index/index': path.join('src/js/index/index.js')
     * },
     */
    output: {
        path: staticCfg.contentPath,
        publicPath: staticCfg.publicPath, //"http://localhost:8089/dist/",
        filename: staticCfg.fileName
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
                 * .babelrc rc结尾的文件通常代表运行时自动加载的文件
                 */
                {
                    test: /\.js(x)*$/,
                    include: [
                        // 只去解析运行目录下的 src 文件夹
                        path.join(process.cwd(), './src')
                    ],
                    exclude: /node_modules/,
                    //"compact": false 不压缩代码，一般用在测试与生产环境
                    /*loader:'babel'*/
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
                {test: /\.css$/,loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
                {test: /\.less$/,loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')},
                {test: /\.json$/,loader: "json"},
                //图片大小小于这个限制的时候，会自动启用base64编码图片
                {test: /\.(gif|jpg|jpeg|png|woff|svg|eot|ttf)\??.*$/,loader: 'url-loader?limit=40000&name=[path][name].[ext]'}
            ]
            /**
             * preloader 会在其他 loader 前应用
             */
            /*,preLoaders:[{
                test: /\.js$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            }]*/
    },
    /**
     * 用来拓展Webpack功能,会在整个构建过程中生效，执行相关的任务
     */
    plugins: [
        //根据模块调用次数，给模块分配ids，常被调用的ids分配更短的id，使得ids可预测，降低文件大小
        new webpack.optimize.OccurenceOrderPlugin(),
        //有些JS库有自己的依赖树，并且这些库可能有交叉的依赖，DedupePlugin打包的时候可以找出他们并删除重复的依赖。
        new webpack.optimize.DedupePlugin(),
        //引用之前打包好的dll文件，注意下context参数，这个应该根据manifest.json文件中的引用情况来赋值，如果引用的都是npm安装的库，这里就填项目根目录就好了。*/
        new webpack.DllReferencePlugin({
            context: staticCfg.rootPath,
            /**
             * 在这里引入 manifest 文件
             */
            manifest: require(staticCfg.mainfestPath)
        }),
        new SpritesmithPlugin(staticCfg.sprites),
        /**
         * 该插件会提取entry chunk中所有的 require('*.css') ，分离出独立的css文件。免得以后只修改 css 导致 浏览器端 js 的缓存也失效了。
         * 同时可以避免css在js中导致闪屏
         */
        new ExtractTextPlugin('[name].css', { allChunks: true }),
        //跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。
        new webpack.NoErrorsPlugin(),
        /**
         * 提取多个入口文件中的公共模块到vendor.min.js中(vendor: ['react','react-dom'])
         * CommonsChunkPlugin 可以将相同的模块提取出来单独打包，进而减小 rebuild 时的性能消耗 如 ['home','index']
         * new webpack.optimize.CommonsChunkPlugin("admin-commons.js", ["ap1", "ap2"]),
         * new webpack.optimize.CommonsChunkPlugin("commons.js", ["p1", "p2", "admin-commons.js"])
         * 若引用dll的vendor.dll.js则不需要CommonsChunkPlugin
         */
        /*new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.min.js')*/
    ],
    /**
     * PostCSS来为CSS代码自动添加适应不同浏览器的CSS前缀（hack）
     * 调用autoprefixer插件（自动添加前缀的插件）
     */
    postcss: [
        require('autoprefixer')
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
        extensions: ['', '.js', '.jsx', '.json', '.css', '.less', '.sass', '.scss', '.tpl'],
        //别名配置 import $ from 'test'
        /*alias: {
           //test:path.resolve(__dirname,'test.js'),
        }*/
    },
};

/**
 * 配置自动化
 * 使用 glob 动态添加 entry入口index，生成一个键值对
 * key形如 /*.entry,value是入口文件的路径。之后设置给config.entry
 * 尽量以 glob 的方式匹配文件，避免增加一个业务文件就需要修改配置
 */
let entryFiles = glob.sync('./src/js/**/*.entry.js');
let newEntries = entryFiles.reduce((memo, filePath) => {
    newfilePath = replacePath(filePath);
    let key = newfilePath.substring(newfilePath.lastIndexOf(path.sep), newfilePath.lastIndexOf('.'));
    console.log("chunk:" + key + " &&&&& file:" + filePath);
    //若用gulp启动devserver 需要在gulpfile webpackDevServer中配置
    //config.entry.key.unshift("webpack-dev-server/client?http://localhost:8089/", "webpack/hot/dev-server");
    memo[key] = [path.join(staticCfg.rootPath, filePath)]
    return memo;
}, {});

/**
 * 动态映射入口文件的Html
 * title : 标题。
 * filename : 文件的名称
 * template : 模板的路径
 * inject :true | ‘head’ | ‘body’ | false 。把所有产出文件注入到给定的 template true,body时js放在body底部，head放head内
 * favicon : 图标路径。
 * minify : 配置object来压缩输出。
 * hash : true | false。如果是true，会给所有包含的script和css添加一个唯一的webpack编译hash值。这对于缓存清除非常有用。
 * cache : true | false 。如果传入true（默认），只有在文件变化时才 发送（emit）文件。
 * showErrors : true | false 。如果传入true（默认），错误信息将写入html页面。
 * chunks : 只允许你添加chunks 。（例如：只有单元测试块 ）
 * chunksSortMode : 在chunk被插入到html之前，你可以控制它们的排序。允许的值 ‘none’ | ‘auto’ | ‘dependency’ | {function} 默认为‘auto’.
 * excludeChunks : 允许你跳过一些chunks（例如，不要单元测试的 chunk）.
 * xhtml : 用于生成的HTML文件的标题。
 * title : true | false。如果是true，把link标签渲染为自闭合标签，XHTML要这么干的。默认false。
 */
let htmlWebpackPlugins = entryFiles.map((filePath) => {
    if (filePath.indexOf('common') > -1) return;
    newfilePath = replacePath(filePath);
    let name = newfilePath.substring(newfilePath.lastIndexOf("/") + 1, newfilePath.length - 9);
    let chunks = [
        './js/common/kit/util.entry',
        newfilePath.substring(0, newfilePath.lastIndexOf("."))
    ]
    console.log("HtmlWebpackPlugin:" + name + " &&&&& file:" + filePath);
    let htmlConfig = {
        title: name,
        filename: `./views/${name}.html`,
        template: `./src/views/${name}.html`,
        inject: true,
        hash: true,
        chunks: chunks //指定要加入的入口文件
    }
    if (staticCfg.isProduction) {
        htmlConfig["minify"] = {
            removeComments: true, //去注释
            collapseWhitespace: true, //压缩空格
            removeAttributeQuotes: true //去除属性引用
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
        }
    }
    let htmlWebpackPlugin = new HtmlWebpackPlugin(htmlConfig);
    config.plugins.push(htmlWebpackPlugin);
    return htmlWebpackPlugin;
});

/**
 * Object.assign 合并对象
 */
config.entry = Object.assign({}, config.entry, newEntries);

function replacePath(filePath) {
    return filePath.replace("./src/", "");
}

/**
 * 作一个 node 模块 gulp调用
 */
module.exports = config;