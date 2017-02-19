/**
 * gulp 自动化构建任务
 * gulp + webpack的基本玩法就是 配置一个基础的webpackConfig，gulp的task里，根据需要，动态微调基本的webpackConfig。
 */
let gulp = require("gulp")
    ,gutil = require("gulp-util")
    ,del = require('del')
    ,webpack = require("webpack")
    ,WebpackDevServer = require("webpack-dev-server")
    ,webpackConfig = require("./webpack.config.js")
    ,webpackDllConfig = require("./webpack.dll.config.js")
    ,staticCfg= require('./config')
    ,mockServer = require('./mockServer')
    ,url = require('url')
    ,_=require('lodash');

/**
 * webpack配置
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
var devConfig, devCompiler;

devConfig = Object.create(webpackConfig);
if(!staticCfg.isProduction){
    //devConfig.devtool = "eval-source-map";// "sourcemap";
    devConfig.debug = true;
}
//扩展webpack插件
devConfig.plugins = devConfig.plugins.concat(getWebPackPlugins());
//编译webpack
devCompiler = webpack(devConfig);

/**
 * 单个任务测试
 */
gulp.task("buildserver",webpackDevServer)

/*
 * default 开发环境 build task
 * 命令行L gulp 可不输入default
 * gulp.task('prod', [a,b,c]);多个任务错乱执行
 * gulp.parallel(a,b,c): 并行执行 任务执行完成可以添加回调函数
 * gulp.series: 串行执行
 */
gulp.task("default", gulp.series(
    clean,
    webpackDll,
    gulp.parallel(webpackDevelopment),
    webpackDevServer,
    buildCallBack
));

/**
 * build 生产环境 build task
 * 命令行L gulp build
 */
gulp.task("build", gulp.series(
    clean,
    webpackDll,
    gulp.parallel(webpackProduction),
    buildCallBack
));

/**
 * 执行任务成功回调函数
 */
function buildCallBack(callback){
    if(staticCfg.isProduction){
        console.log('production build success');
    }else{
        console.log('development build success');
    }
    callback();
}

/**
 * 清空bin/dist
 * 并非所有的任务都是基于流，例如删除文件
 * 一个 gulpfile 只是一个 Node 程序，在 gulpfile 中可以使用任何 npm 中的模块或者其他 Node.js 程序
 */
function clean(){
    if(staticCfg.isProduction)
        return del(['bin']);
    return del(['dist']);
}

/**
 * production 生产环境构建任务
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */


function webpackProduction(done) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:production", err);
		gutil.log("[webpack:production]", stats.toString({
			colors: true
		}));
		callback();
    });
}

/**
 * development 开发环境构建任务
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
function webpackDevelopment(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:development", err);
		gutil.log("[webpack:development]", stats.toString({
            colors: true
        }));
        callback();
    });
}

/**
 * dll 生成第三方库dll任务
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
function webpackDll(callback) {
    webpack(webpackDllConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:dll", err);
		gutil.log("[webpack:dll]", stats.toString({
            colors: true
        }));
        callback();
	});
}

/**
 * 启动 webpack 开发环境服务
 * 建本地服务器(热启动,自动刷新浏览器)
 * 将在 localhost:8080 启动一个 express 静态资源 web 服务器，并且会以监听模式自动运行 webpack，
 * 在浏览器打开 http://localhost:8080/可以浏览项目中的页面和编译后的资源输出，
 * 并且通过一个 socket.io 服务实时监听它们的变化并自动刷新页面。
 * contentBase	默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）
 * quiet: //控制台中不输出打包的信息，开发中一般设置为false，进行 打印，这样查看错误比较方面
 * no-info: // 不显示任何信息
 * colors: //对信息进行颜色输出
 * no-colors: //对信息不进行颜色输出
 * compress:  //开启gzip压缩
 * host <hostname/ip>: //设置ip
 * port <number>: //设置端口号，默认是:8080
 * inline: //webpack-dev-server会在你的webpack.config.js的入口配置文件中再添加一个入口,
 * hot: //开发热替换
 * open: //启动命令，自动打开浏览器
 * progress: true, //显示打包的进度
 * history-api-fallback: //查看历史url
 */
function webpackDevServer(callback) {
    //这两项配置原本是在webpack.config.dev.js里边配置，可是通过gulp启动devserver，那种配置无效，只能在此处写入
    //官网的解释是webpack-dev-server没有权限读取webpack的配置
    let entrys = _.tail(Object.getOwnPropertyNames(devConfig.entry));
    _.map(entrys, (item) => {
        //每个页面entry入口 devConfig.entry[item]
        return devConfig.entry[item].unshift("webpack-dev-server/client?http://localhost:8089/", "webpack/hot/dev-server");
    });
    var server = new WebpackDevServer(devCompiler,{
        stats:{colors: true},
        contentBase:"dist",
        historyApiFallback: false,
        colors:true,
        inline:true,
        hot:true,
        progress:true,
        // Make connection between webpack-dev-server and its runtime set inline: true
        headers:{"Access-Control-Allow-Origin": "*"},
        proxy:{
            '/api/*': {
                target: staticCfg.apiHost,
                secure: false
            }
        },
        //拦截ajax请求并处理
        middleware:function(req,res,next){
            console.log(req);
            var urlObj = url.parse(req.url, true),
                method = req.method,//方法名 post get put del
                paramObj = urlObj.query;//url参数
            mockServer(res, urlObj.pathname, paramObj, next);
        }
        /*
        quiet:true,
        noInfo:true,
        lazy:false,
        compress:true,
        */
    });
    server.listen(8089, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log('[webpack-dev-server]',  staticCfg.publicPath);
        callback();
	});
}


/**
 * getWebPackPlugins 根据环境配置webpack插件Plugins
 * @return 数组 Plugins
 */
function getWebPackPlugins(){
    if(!staticCfg.isProduction){
      return [
            /**
            * 自动刷新和热加载 动态的更新局部模块代码，而不需要刷新整个页面
            * devtool的hot 选项开启了代码热替换
            * 用sourcemap时不能使用HMR
            * 与dev-server的hot区别是：不用刷新页面，可用于生产环境
            * –inline 是刷新后的代码自动注入到打包后的文件中(当源文件改变时会自动刷新页面)
            * -d 是debug模式，输入一个source-map，并且可以看到每一个打包的文件=
            */
            new webpack.HotModuleReplacementPlugin()
        ]
    }else{
        return [
            // 备案
            /*new webpack.BannerPlugin('(招聘前端) => {QQ：340636803}'))*/
            //合并请求 限制最大chunk数
            new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15})
            //合并请求 限制最小chunk数
            ,new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
            /**
            * 开启 gzip 压缩 js 与 css
            * 构建后生产对应入口文件 *.entry.min.js.gz
            */
            ,new require('compression-webpack-plugin')({
                asset: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.8
            })
            /**
            * 合并压缩混淆
            */
            ,new webpack.optimize.UglifyJsPlugin({
                //去掉注释
                comments: false,
                //去除console,debugger
                compress: {
                    //忽略警告,要不然会有一大堆的黄色字体出现
                    warnings: false,
                    drop_debugger: true, //生产用true
                    drop_console: true //生产用true
                },
                //可以在线上生成soucemap文件，便于调试，会导致编译过程变慢
                sourceMap: true,
                //防止命名空间冲突或覆盖
                mangle: {
                    except: ['$', 'exports', 'require', '_']
                },
                minimize: true
            })
            /**
            * 可以定义编译时的全局变量，有很多库（React, Vue等）会根据 NODE_ENV 这个变量来判断当前环境
            */
            ,new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("production")
                }
            })
        ]
    }
}