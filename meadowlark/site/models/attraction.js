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

AttractionSchema.methods.getAll = function(wherestr){
    Attraction.find(wherestr, (err, result) => {
        if(err) return null
        return result;
    });
};

AttractionSchema.methods.findById = function(id){
    var wherestr = {_id: id};
    Attraction.find(wherestr,(err, result) => {
        if(err) return null
        return result;
    });
};

AttractionSchema.methods.insert = function(model){
    let attraction = new Attraction(model);
    attraction.save((err,result) => {
        if(err) return null
        return result;
    });
};

AttractionSchema.methods.update = function(wherestr, updatestr){
    Attraction.update(wherestr, updatestr, (err, result) => {
        if(err) return null
        return result;
    });
};

AttractionSchema.methods.delete = function(wherestr){
    Attraction.remove(wherestr, (err, result) => {
        if(err) return false
        return true;
    });
};


//创建模型
var Attraction = mongoose.model('Attraction', AttractionSchema);
module.exports = Attraction;