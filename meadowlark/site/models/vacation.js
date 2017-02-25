/**
 * 数据和逻辑
 * @type {*|exports}
 */
var mongoose = require('mongoose');

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

VacationSchema.methods.getAll = function(wherestr){
    Vacation.find(wherestr, (err, result) => {
        if(err) return null
        return result;
    });
};

VacationSchema.methods.findById = function(id){
    var wherestr = {_id: id};
    Vacation.find(wherestr,(err, result) => {
        if(err) return null
        return result;
    });
};

VacationSchema.methods.insert = function(model){
    let Vacation = new Vacation(model);
    Vacation.save((err,result) => {
        if(err) return null
        return result;
    });
};

VacationSchema.methods.update = function(wherestr, updatestr){
    Vacation.update(wherestr, updatestr, (err, result) => {
        if(err) return null
        return result;
    });
};

VacationSchema.methods.delete = function(wherestr){
    Vacation.remove(wherestr, (err, result) => {
        if(err) return false
        return true;
    });
};

//创建模型
var Vacation = mongoose.model('Vacation', VacationSchema);
module.exports = Vacation;