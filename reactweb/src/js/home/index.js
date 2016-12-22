import 'babel-polyfill'; //兼容低版本浏览器,只需在index.js中加入
import './../../css/common/main.css';
import React from 'react';
import { render } from 'react-dom';
import Greeter from './Greeter';
import $ from 'jquery';

const myPromise = Promise.resolve(42);
myPromise.then((number) => {
    console.log(number)
    $('body').append('<p>promise结果是：' + number + '</p>');
})
render( < Greeter / > , document.getElementById("root"));