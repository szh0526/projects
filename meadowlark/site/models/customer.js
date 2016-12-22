/**
 * Created by sunzehao on 2016/12/2.
 * 模型 数据和逻辑
 */
var mongoose = require('mongoose');
var Orders = null;// require('./orders.js');
var customerSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    salesNotes: [{
        date: Date,
        salespersonId: Number,
        notes: String
    }]
});
customerSchema.methods.getOrders = function(){
    return Orders.find({ customerId: this._id });
};
var Customer = mongoose.model('Customer', customerSchema);
module.export = Customer;