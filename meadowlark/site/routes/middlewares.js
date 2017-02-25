/**
 * Created by sunzehao on 2016/11/25.
 * 中间件处理器
 * 常用中间件:
 * var connect = require('connect')();
 * compress app.use(connect.compress); //用gzip 压缩响应数据
 * morgan app.use(require(morgan)()); //自动日志记录
 * csurf app.use(require(csurf)()); //防范跨域请求伪造（CSRF）攻击
 * response-time app.use(require(response-time)()); //向响应中添加X-Response-Time 头，性能调优时才需要这个中间件。
 * errorhandler app.use(require(errorhandler)()); //为客户端提供栈追踪和错误消息
 * method-override app.use(require(methodoverride)()); //允许浏览器“假装”使用除GET 和POST之外的HTTP 方法。编写API 调试时使用。
 * */
let credentials = require("../lib/credentials.js")
    ,express = require('express')
    ,cluster = require('cluster')
    ,bodyparser = require('body-parser')
    ,cookieparser = require('cookie-parser')
    ,expresssession = require('express-session')
    ,MongoSessionStore = require('session-mongoose')(require('connect'))
    ,cors = require('cors')
    ,mongoose = require('mongoose')
    ,fs = require('fs')
    ,csurf = require('csurf');
const getstatic = require('../lib/static.js').map;


/**
 * express默认配置
 * @param app
 */
exports.defaultSettingsHandler = (app) => {
    app.set('port', process.env.PORT || 3000);//设置端口号 环境变量process.env.PORT
    app.disable('x-powered-by');//禁用Express 的X-Powered-By 头信息
    /**
     * 设置handlebars 视图引擎 main主模板 服务器端模板在WEB端隐藏实现细节，支持模板缓存
     */
    var handlebars = require('express3-handlebars').create({
        defaultLayout: 'main',
        helpers: {
            section(name, options){
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            },
            static(name){
                return getstatic(name);
            }
        }
    });
    app.engine('handlebars', handlebars.engine);//配置模板引擎
    app.set('view cache', false); //生产模式下启用视图缓存 true
    app.set('view engine', 'handlebars');

    //return undefined;
};
/**
 * 允许跨域资源共享 只有在api接口时才允许跨域
 */
exports.allowApiCorsHandler = () => {
   return cors();
};
/**
 * 初始化mongodb
 */
exports.initMongoDbHandler = (app,rootpath) => {
    // 数据库配置
    var opts = {
        server: {
            socketOptions: {keepAlive: 1}
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
             path: rootpath + '/log/requests.log'
             }));*/
            mongoose.connect(credentials.mongo.production.connectionString, opts);
            break;
        default:
            throw new Error('Unknown execution environment: ' + app.get('env'));
    }
};

/**
 * static 中间件给所有静态文件创建了路由  放在所有路由前面
 */
exports.staticshHandler = (path) => {
    return express.static(path);
};

/**
 * bodyparser中:1.urlencoded中间件处理表单和AJAX请求 2.json中间件返回json格式
 */
exports.bodyParserHandler = () => {
    return bodyparser();
};

/**
 * cookie-parser 处理cookie
 */
exports.cookieParserHandler = () => {
    return cookieparser(credentials.cookieSecret);
};

/**
 * expresssession中：会话的存储方式使用数据库存储
 */
exports.expressSessionHandler = () => {
    var sessionStore = new MongoSessionStore({url: credentials.mongo.production.connectionString});
    return expresssession({store: sessionStore});
};

/**
 * 跨站请求伪造csurf
 */
exports.csurfHandler = () => {
    return csurf();
};

/**
 * http://localhost:3000/about_test?test=1
 * 中间件是一种功能的封装方式，具体来说就是封装在程序中处理HTTP 请求的功能
 */
exports.commonHandler = (app) => {
    return (req, res, next) => {
        //集群模式下,在每个请求上得到不同的工作线程
        if(cluster.isWorker) console.log('工作线程 %d 收到请求', cluster.worker.id);
        //locals 是一个对象，包含用于渲染视图的默认上下文。
        res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
        res.locals.logoImage = getstatic('/img/logo.png');
        // 如果有即显消息，把它传到上下文中，然后清除它
        res.locals.flash = req.session.flash;
        delete req.session.flash;
        next();
    }
};

/**
 * 处理未捕获的异常
 */
exports.notCatchHandler = (server) => {
    return (req, res, next) => {
        // 为这个请求创建一个域
        var domain = require('domain').create();
        // 处理这个域中的错误
        domain.on('error', (err) => {
            console.error('DOMAIN ERROR CAUGHT\n', err.stack);
            try{
                // 在5 秒内进行故障保护关机
                setTimeout(() => {
                    console.error('Failsafe shutdown.');
                    process.exit(1);
                }, 5000);
                // 从集群中断开
                var worker = cluster.worker;
                if(worker) worker.disconnect();
                // 停止接收新请求
                server.close();
                try{
                    // 尝试使用Express 错误路由
                    next(err);
                }catch(err){
                    // 如果Express 错误路由失效，尝试返回普通文本响应
                    console.error('Express error mechanism failed.\n', err.stack);
                    res.statusCode = 500;
                    res.setHeader('content-type', 'text/plain');
                    res.end('Server error.');
                }
            }catch(err){
                console.error('Unable to send 500 response.\n', err.stack);
            }
        });
        // 向域中添加请求和响应对象
        domain.add(req);
        domain.add(res);
        // 执行该域中剩余的请求链
        domain.run(next);
    }
};

/**
 * 自动化渲染视图  可以直接添加视图到views下并浏览器请求
 */
exports.autoViewHandler = (rootpath) => {
    var autoViews = {};
    return (req,res,next) => {
        var path = req.path.toLowerCase();
        // 检查缓存；如果它在那里，渲染这个视图
        if(autoViews[path]) res.render(autoViews[path]);
        // 如果它不在缓存里，那就看看有没有.handlebars 文件能匹配
        if(fs.existsSync(rootpath + '/views' + path + '.handlebars')){
            autoViews[path] = path.replace(/^\//, '');
            res.render(autoViews[path]);
        }
        console.log(rootpath)
        // 没发现视图；转到404 处理器
        next();
    }
};

/**
 * 404 catch-all 处理器（中间件）
 * 响应码
 * 200（OK）
 * 500（服务器内部错误）
 * 404（未找到）
 * 400（错误的请求）
 * 401（未授权）
 */
exports.notFoundHandler = () => {
    return (req, res, next) => {
        res.status(404).render('404');
    }
};

/**
 * 500 错误处理器（中间件）
 */
exports.serverErrHandler = () => {
    return (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).render('500');
    }
};