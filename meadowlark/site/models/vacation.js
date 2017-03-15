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
var VacationSchema = mongoose.Schema({
    name: String,
    slug: String,
    category: String,
    sku: String,
    description: String,
    priceInCents: Number,
    tags: [String],
    inSeason: Boolean,
    available: Boolean,
    requiresWaiver: Boolean,
    maximumGuests: Number,
    notes: String,
    updateId: String,
    packagesSold: Number
});

//扩展方法 获取显示价格
VacationSchema.methods.getDisplayPrice = function(){
    var _this = this;
    return '$' + (_this.priceInCents / 100).toFixed(2);
};

//创建模型 model第一个参数是数据库表名
var VacationModel = mongoose.model('Vacations', VacationSchema);

class Vacation extends BaseClass{
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

let vacation = new Vacation(VacationModel);

export default vacation;