/*require('./css/main.css');*/
import 'babel-polyfill'; //兼容低版本浏览器,只需在index.js中加入
import './../../css/common/main';
import React from 'react';
import ReactDOM from 'react-dom';
import Greeter from './Greeter';
import $ from 'jquery';

$.ajax({
    url:"http://localhost:9999/api/index/getAll",
    dataType:'jsonp',
    data:{
        name:"孙浩",
        pwd:123
    },
    jsonp:'callback',
    success:function(data) {
        console.log(data);
    },
    error:function(){
        console.log("异常");
    },
    timeout:3000
});

//var fetch = require('node-fetch');
//fetch('http://localhost:9999/api/getAll').then(res => res.json()).then(data => console.log(data))



const myPromise = Promise.resolve(43);
myPromise.then((number) => {
    //$.error('arguments is not number');
    console.log(number)
    $('body').append('<p>promise结果是：' + number + '</p>');
})
ReactDOM.render( < Greeter / > , document.getElementById("root"));