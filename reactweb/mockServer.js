/**
 * mockServer 前端分离api接口,动态映射模拟数据
 * 拦截jsonp跨域请求“转发”到本地文件，其实就是读取本地mock文件，并以json或者script等格式返回给浏览器
 * 步骤:
 * 1.根据功能制定前后端接口（API）。
 * 2.根据接口构建Mock Server工程及其部署。
 * 3.前后端独立开发，前端向Mock Server发送请求，获取模拟的数据进行开发和测试。
 * 4.前后端都完成后，前后端连接调试（前端修改配置向Real Server而不是Mock Server发送请求）
 */
let fs = require('fs')
    ,path = require('path')
    ,mockPath = path.join(__dirname, 'mock');


/**
 * getPath 获取json文件绝对路径
 * @param  router    url路径
 * @return file
 */
let getPath = (router) => {
    return path.join(mockPath, router + ".json");
}

/**
 * getRequestJson 根据路径同步读取json数据
 * @param  router    路由 如/index/getAll
 * @return json      返回 ./mock/index/getAll.json
 */
let getJsonByRouter = (router) => {
    let filepath = getPath(router);
    //同步读取
    return fs.readFileSync(filepath,'utf-8');
}

/**
 * getWebPackPlugins 根据环境配置webpack插件Plugins
 * @param  res       response
 * @param  pathname  方法名
 * @param  paramObj  url参数 暂时不用 可以根据参数响应不同的json数据
 * @param  next      next路由
 * @return 响应json数据给浏览器
 */
let mockServer = (res, pathname, paramObj, next) => {
    //router 如 /api/index/getAll
    let router = pathname.replace("/api","")
        ,data = getJsonByRouter(router);

    /*console.log("-----------------");
    console.log(paramObj);
    console.log(paramObj.callback);
    console.log(router);
    console.log(data);
    console.log("-----------------");*/
    //设置响应头信息
    if(data){
        res.setHeader('Content-type', 'application/javascript');
        res.end(paramObj.callback + '(' + data + ')');
        return;
    }

    next();
};

module.exports = mockServer;