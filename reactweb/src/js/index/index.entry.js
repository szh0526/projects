/*require('./css/main.css');*/
import 'babel-polyfill'; //兼容低版本浏览器,相关模块只需要在此引一次
import FetchApi from '../common/kit/request';
import './../../css/common/main';
import React from 'react';
import ReactDOM from 'react-dom';
import Greeter from './Greeter';
import $ from 'jquery';

let geturl = "http://127.0.0.1:3000/api/aJson?a=1&b=2";
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
let data3 = f.request(htmlurl).then(getData).catch(errorfn);

const myPromise = Promise.resolve(43);
myPromise.then((number) => {
    //$.error('arguments is not number');
    console.log(number)
    $('body').append('<p>promise结果是：' + number + '</p>');
})
ReactDOM.render( < Greeter / > , document.getElementById("root"));