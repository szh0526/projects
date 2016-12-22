/**
 * 数据和逻辑
 * @type {*|exports}
 */
var mongoose = require('mongoose');

//定义模式
var vacationSchema = mongoose.Schema({
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
    packagesSold: Number
});

//扩展方法 获取显示价格
vacationSchema.methods.getDisplayPrice = function(){
    var _this = this;
    return '$' + (_this.priceInCents / 100).toFixed(2);
};

//创建模型
var Vacation = mongoose.model('Vacation', vacationSchema);
module.exports = Vacation;