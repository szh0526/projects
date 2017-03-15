/**
 * 数据和逻辑
 * Mongoose是MongoDB的一个对象模型工具，是基于node-mongodb-native开发的MongoDB nodejs驱动
 * Schema ： 一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
 * Model ： 由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
 * Entity ： 由Model创建的实体，他的操作也会影响数据库
 */
import BaseClass from './base/baseClass';
let promise = require('bluebird'); //promise的具体实现
let mongoose = require('mongoose');
mongoose.Promise = promise;

//定义模式
let AttractionSchema = mongoose.Schema({
    name: String,
    description: String,
    location: { lat: Number, lng: Number },
    history: {
        event: String,
        notes: String,
        email: String,
        date: Date
    },
    updateId: String,
    approved: Boolean
});

//创建模型 model第一个参数是数据库表名
let AttractionModel = mongoose.model('Attractions', AttractionSchema);

class Attraction extends BaseClass{
    constructor(model){
        super(model);
    }

    fun1(){
        console.log(1)
    }
    fun2(){
        console.log(2)
    }
}

let attraction = new Attraction(AttractionModel);

export default attraction;