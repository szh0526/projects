import 'babel-polyfill'; //兼容低版本浏览器,只需在index.js中加入
import './../../css/common/main.css';
import React from 'react';
import { render } from 'react-dom';
import Greeter from './Greeter';
import $ from 'jquery';

const myPromise = Promise.resolve(43);
myPromise.then((number) => {
    //$.error('arguments is not number');
    console.log(number)
    $('body').append('<p>promise结果是：' + number + '</p>');
})
render( < Greeter / > , document.getElementById("root"));