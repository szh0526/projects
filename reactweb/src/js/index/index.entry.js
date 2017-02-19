/*require('./css/main.css');*/
import 'babel-polyfill'; //兼容低版本浏览器,只需在index.js中加入
import './../../css/common/main';
import React from 'react';
import ReactDOM from 'react-dom';
import Greeter from './Greeter';
import $ from 'jquery';

$.ajax({
    url: "http://localhost:3000/api/index/getAll?a=1",
    type: "POST",
    data: {test: 1},
    success: function(data) {
        // OK
        console.log(data);
    },
    error:function(){
        console.log(1);
    }
})


const myPromise = Promise.resolve(43);
myPromise.then((number) => {
    //$.error('arguments is not number');
    console.log(number)
    $('body').append('<p>promise结果是：' + number + '</p>');
})
ReactDOM.render( < Greeter / > , document.getElementById("root"));