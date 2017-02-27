/**
 * 数据和逻辑
 * Mongoose是MongoDB的一个对象模型工具，是基于node-mongodb-native开发的MongoDB nodejs驱动
 * Schema ： 一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
 * Model ： 由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
 * Entity ： 由Model创建的实体，他的操作也会影响数据库
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

//创建模型
var AttractionModel = mongoose.model('Attraction', AttractionSchema);

let getAll = (wherestr) => {
    AttractionModel.find(wherestr, (err, result) => {
        if(err) return null
        return result;
    });
};

let findById = (id) => {
    AttractionModel.find({_id: id},(err, result) => {
        if(err) return null
        return result;
    });
};

let insert = (model) => {
    let attractionEntity = new Attraction(model);
    attractionEntity.save((err,result) => {
        if(err) return null
        return result;
    });
};

let update = (wherestr, updatestr) => {
    AttractionModel.update(wherestr, updatestr, (err, result) => {
        if(err) return null
        return result;
    });
};

let remove = (wherestr) => {
    AttractionModel..remove(wherestr, (err, result) => {
        if(err) return false
        return true;
    });

    //关闭数据库链接
    //db.disconnect();
};

export {
  findById as find,
  getAll,
  insert,
  update,
  remove
};