/**
 * 数据和逻辑
 * @type {*|exports}
 */
var mongoose = require('mongoose');

//定义模式
var AttractionSchema = mongoose.Schema({
    //id:Number, _id
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

//扩展方法 转换经纬度google-to-baidu
AttractionSchema.methods.getBaiduPoint = function(){
    return {
        lat: 123
        , lng: 321
    }
};

//创建模型
var Attraction = mongoose.model('Attraction', AttractionSchema);
module.exports = Attraction;