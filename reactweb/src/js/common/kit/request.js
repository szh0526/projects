/**
 * Fetch API 是基于 Promise 设计，旧浏览器不支持 Promise，需要使用 polyfill es6-promise
 * Fetch 请求默认是不带cookie的，需要设置fetch(url, {credentials: 'include'})
 * fetch的polyfill实现:
 * 1.isomorphic-fetch: 兼容node和browser环境 同构import fetch from 'isomorphic-fetch'
 * 2.whatwg-fetch:结合Promise使用XMLHttpRequest 客户端require whatwg-fetch
 * 3.babel-polyfill 或 es6-promise支持IE9以上的版本
 * 优点：
 * 1.语法简洁，更加语义化
 * 2.基于标准 Promise 实现，支持 async/await
 * 3.同构方便，使用 isomorphic-fetch
 */
//import 'babel-polyfill'; 入口文件引入
import 'isomorphic-fetch';
import fetchJsonp from 'fetch-jsonp';

export default class FetchApi {

    constructor() {
        this.checkStatus = this.checkStatus.bind(this);
        this.getJson = this.getJson.bind(this);
        this.error = this.error.bind(this);
    }

    /**
    * 同步异步请求方法
    * @param  url 请求地址
    * @return fetch Promise对象
    */
    request(url, options = {}){
        options = this.transOptions(options);
        return fetch(url,options).then(this.checkStatus,this.error).then(this.getJson,this.error);
    }

    /**
    * 跨域异步请求 只支持GET
    * 服务端response.setHeader("Access-Control-Allow-Origin", "*");
    * @param  url  请求地址
    * @param  options timeout:超时时间,默认5秒 jsonpCallback:callbackname 默认'jsonp_callback'
    * @return fetch Promise对象
    */
    requestJsonp(url){
        return fetchJsonp(url).then(this.checkStatus,this.error).then(this.getJson,this.error);
    }

    /**
    * 设置请求参数
    * @param options = {
    *   method - 使用的HTTP动词，GET, POST, PUT, DELETE, HEAD
    *   url - 请求地址，URL of the request
    *   headers - 关联的Header对象
    *   referrer - referrer
    *   mode - 请求的模式，主要用于跨域设置，cors, no-cors, same-origin
    *   credentials - 是否发送Cookie omit, same-origin
    *   redirect - 收到重定向请求之后的操作，follow, error, manual
    *   integrity - 完整性校验
    *   cache - 缓存模式(default, reload, no-cache)
    * }
    * @returns options 配置
    */
    transOptions(options){
        let opt = {
            credentials: 'include',
            mode: 'cors',
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
            },
            cache: 'default'
        };
        opt = Object.assign(opt,options);
        return opt;
    }

    /**
    * 截获异常信息
    * @param err
    * @returns err
    */
    error(err){
        throw new Error(err);
    }

    /**
    * 检查异步请求状态
    * fetch返回的promise在http状态400、500等不会reject，被resolve；只有网络错误会导致请求不能完成时才被reject；
    * @param response
    * @returns {*}
    */
    checkStatus(response){
        if(response.status){
            if (response.status >= 200 && response.status < 300) {
                return response;
            }
        }
        if(response.ok){
            return response;
        }
        throw new Error(response.statusText);
    }

    /**
    * 根据type返回不同格式的response
    * @param response
    * @returns {*}
    */
    getJson(response){
        let type = response.headers ? response.headers.get('Content-Type').split(";")[0] : 'application/json';
        switch (type) {
            case 'text/html':
                return response.text();
                break;
            case 'application/json':
                return response.json();
                break;
            default:
                return;
                break;
        }
    }

}


/**
 * fetch支持超时timeout处理
 * @param  url  请求地址
 * @param  options
 * @return fetch Promise对象
 */
/*var oldFetchfn = fetch; //拦截原始的fetch方法
window.fetch = function(input, opts){//定义新的fetch方法，封装原有的fetch方法
    var fetchPromise = oldFetchfn(input, opts);
    var timeoutPromise = new Promise(function(resolve, reject){
        setTimeout(()=>{
            reject(new Error("fetch timeout"))
        }, opts.timeout)
    });
    //Promise.race方法接受promise[]，表示多个promise任何一个先改变状态，race方法返回的promise实例状态就跟着改变
    return Promise.race([fetchPromise, timeoutPromise]);
}*/

/*let geturl = "http://127.0.0.1:3000/api/aJson?a=1&b=2";
let posturl = "http://127.0.0.1:3000/api/bJson";
let htmlurl = "http://localhost:8089/test.html";
let jsonpurl = "http://localhost:9999/api/index/getJsonp";
let f = new FetchApi();
let getData = data => {
    console.log(data);
    return data
};
let errorfn = err => {throw new Error(err)};
let opts = {method: 'POST',body:{name: '试打算打',login: 'hubot'}};
let data1 = f.request(posturl,opts).then(getData).catch(errorfn);
let data2 = f.request(geturl).then(getData).catch(errorfn);
let data4 = f.requestJsonp(jsonpurl).then(getData).catch(errorfn);
let data3 = f.request(htmlurl).then(getData).catch(errorfn);*/