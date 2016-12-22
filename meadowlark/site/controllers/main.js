/**
 * index控制器
 */
var config = require('../lib/config.js');
var cluster = require('cluster');

exports = {
    //把路由整理在一起更清晰
    registerRoutes: (app) => {
        const _self = this;
        app.get('/', _self.home);
        app.get('/about/:id/:name', _self.about);
        app.get('/thank-you', _self.thankyou);
        app.get('/headers', _self.headers);
        app.get('/custom-layout', _self.customLayout);
        app.get('/error', _self.error);
        app.get('/epic-fail', _self.serverFail);
    },
    home: (req, res, next) => {
        //模板引擎默认状态码200
        res.render('home');
    },
    //如多个站点about/123/聪聪 /cart/:site
    about: (req, res, next) => {
        console.log(req.path);
        console.log(req.params.id);
        console.log(req.params.name);
        res.render('about', {
                fortune: "测试大大"
            }
        );
    },
    thankyou: (req, res, next) => {
        res.type('text/plain').send('Meadowlark Travel');
    },
    //错误处理
    error: (req, res, next) => {
        res.status(500).render('error');
    },
    //服务器宕机异常  集群会创建新的工作线程
    serverFail: (req, res, next) => {
        //当前工作线程宕机
        process.nextTick(function(){
            if(cluster.isWorker) {
                throw new Error("工作进程" + cluster.worker.id + '宕机了!');
            }else{
                throw new Error('宕机了!');
            }
        });
    },
    headers: (req, res, next) => {
        res.set('Content-Type', 'text/plain');
        var s = '';
        for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
        res.send(s);
    },
    customLayout: (req, res, next) => {
        //没有布局的视图渲染{layout: null}
        res.render('custom-layout', {layout: 'custom'});
    }
}