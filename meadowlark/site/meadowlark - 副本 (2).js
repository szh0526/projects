var credentials       = require("./lib/credentials.js");
var express           = require('express');
var http              = require('http');
var mongoose          = require('mongoose');
var app               = express();
var server            = null;//当前node服务
var middlewares       = require("./routes/middlewares.js")(app,server);


/*app.use(middlewares.staticshHandler(__dirname + '/public'))
app.use(middlewares.staticshHandler(__dirname + '/lib'));
app.use(middlewares.bodyParserHandler());
app.use(middlewares.cookieParserHandler());
app.use(middlewares.expressSessionHandler());
var routes = require('./routes/routes.js')(app);
app.use(middlewares.notCatchHandler(server));
app.use(middlewares.commonHandler(app));
app.use(middlewares.notFoundHandler());
app.use(middlewares.serverErrHandler())*/

for(var i = 0;i<middlewares.length;i++){
    var fn = middlewares[i]();
    app.use(fn);
}

/*middlewares.forEach(function(handler){
    console.log(typeof(handler))
    var fn = handler();
    app.use(fn);
})*/

/**
 * 设置handlebars 视图引擎 main主模板 服务器端模板在WEB端隐藏实现细节，支持模板缓存
 */
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);//配置模板引擎
app.set('view cache', false); //生产模式下启用视图缓存 true
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);//设置端口号 环境变量process.env.PORT
app.disable('x-powered-by');//禁用Express 的X-Powered-By 头信息


//初始化mongodb 数据库配置
var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};
switch(app.get('env')){
    case 'development':
        //app.use(require('morgan')('dev'));//开发环境用morgan 紧凑的、彩色的开发日志
        //连接数据库
        mongoose.connect(credentials.mongo.development.connectionString, opts);
        break;
    case 'production':
        //生产环境用express-logger 支持按日志循环
        /*app.use(require('express-logger')({
            path: __dirname + '/log/requests.log'
        }));*/
        mongoose.connect(credentials.mongo.production.connectionString, opts);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}


/**
 * Nginx 高性能的代理服务器 适用于生产环境
 * 用Nginx反向代理或Nodejs反向代理绑定域名为www.xxx.com.cn
 * 例:Nginx服务器有2个网站  80端口是www.gome.com  3000端口是cart.gome.com.cn
 * 基于Node的代理服务器 proxy 或node-http-proxy 适用于开发环境
 */
function startServer(){
    server = http.createServer(app).listen(app.get('port'), function(){
       console.log( 'Express started in ' + app.get('env') +
       ' mode on http://localhost:' + app.get('port') +   ';' );
   });
}
/**
 * meadowlark.js 既可以直接运行（node meadowlark.js）， 也可以通过 require 语句作为一个模块引入
 */
if(require.main === module){
    // 应用程序直接运行；启动应用服务器
    startServer();
} else {
    // 应用程序作为一个模块通过"require" 引入: 导出函数
    // 创建服务器
    module.exports = startServer;
}











