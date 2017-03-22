/*require('./css/main.css');*/
import 'babel-polyfill'; //兼容低版本浏览器,相关模块只需要在此引一次
/*import FetchApi from '../common/kit/request';*/
import './../../css/common/main';
import React from 'react';
import ReactDOM from 'react-dom';
import Greeter from './Greeter';
import $ from 'jquery';

const myPromise = Promise.resolve(43);
myPromise.then((number) => {
    //$.error('arguments is not number');
    console.log(number)
    $('body').append('<p>promise结果是：' + number + '</p>');
})
ReactDOM.render( < Greeter / > , document.getElementById("root"));