import * as middlewares from './routes/middlewares.js';
import initRoutes from './routes/routes.js';
let express = require('express')
    ,http = require('http')
    //,https = require('https'); //与http不能共存
    ,fs = require('fs')
    ,bodyParser = require('body-parser')
    ,app = express()
    ,server = null//当前node服务
    ,rootPath = __dirname;

middlewares.defaultSettingsHandler(app);
app.use(middlewares.staticshHandler(rootPath + '/public'));
app.use(middlewares.staticshHandler(rootPath + '/lib'));
//设置跨域访问 如果采用fetch则启动
var allowCrossDomain = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8089');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Ayuthorization, X-Requested-With');
    res.setHeader("Access-Control-Max-Age", "3600");
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method == 'OPTIONS')
        res.send(200); //让options请求快速返回
    else next();
};
app.all("/api/*",allowCrossDomain);
//如果采用fetch-jsonp则启动
/*app.use("/api",middlewares.allowApiCorsHandler());*/
app.use(middlewares.bodyParserHandler());
app.use(bodyParser.json()); // 解析JSON 编码的请求体。
app.use(bodyParser.urlencoded({ extended: true }));// for parsing application/x-www-form-urlencoded
app.use(middlewares.cookieParserHandler());
app.use(middlewares.expressSessionHandler());
app.use(middlewares.commonHandler(app));
initRoutes(app);
app.use(middlewares.autoViewHandler(rootPath));
app.use(middlewares.notCatchHandler(server));
//放在routes之后
app.use(middlewares.notFoundHandler());
app.use(middlewares.serverErrHandler());
middlewares.initMongoDbHandler(app,rootPath);

/**
 * Nginx 高性能的代理服务器 适用于生产环境
 * 用Nginx反向代理或Nodejs反向代理绑定域名为www.xxx.com.cn
 * 例:Nginx服务器有2个网站  80端口是www.gome.com  3000端口是cart.gome.com.cn
 * 基于Node的代理服务器 proxy 或node-http-proxy 适用于开发环境
 * nginx代理服务器代理http和https请求,然后代理服务器可能通过常规的HTTP跟node或其他应用通信
 * 域名系统（DNS）负责将域名映射到IP地址
 * (1) 用户访问网址http://meadowlarktravel.com/。
 * (2) 浏览器发送请求到用户计算机的网络系统。
 * (3) 用户计算机的网络系统中有网络接入商给出的互联网IP 地址和DNS 服务器，会要求 DNS 服务器解析meadowlarktravel.com。
 * (4) DNS 服务器知道meadowlarktravel.com 是由ns1.webfaction.com（或ns2.webfaction.com等服务器） 处理的，所以要求给出meadowlarktravel.com 的IP 地址。
 * (5) 服务器ns1.webfaction.com 收到请求，认出meadowlarktravel.com 确实是活跃账号，返回与之关联的IP 地址。
 */
function startServer(){

    //http服务 http://localhost:3000
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
