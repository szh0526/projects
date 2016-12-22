/**
 * Created by sunzehao on 2016/12/2.
 * 视图模型
 * 保护模型的完整性
 */
let Customer = require('../models/customer.js');
let _ = require('underscore');

// 联合各域的辅助函数
function smartJoin(arr, separator){
    if(!separator) separator = ' ';
    return arr.filter(function(elt){
        return elt!==undefined &&
            elt!==null &&
            elt.toString().trim() !== '';
    }).join(separator);
}
module.exports = (customerId) => {
    var customer = Customer.findById(customerId);
    if(!customer) return { error: 'Unknown customer ID: ' +
    req.params.customerId };
    var orders = customer.getOrders().map((order) => {
        return {
            orderNumber: order.orderNumber,
            date: order.date,
            status: order.status,
            url: '/orders/' + order.orderNumber
        }
    });
    return {
        firstName: customer.firstName,
        lastName: customer.lastName,
        name: smartJoin([customer.firstName, customer.lastName]),
        email: customer.email,
        address1: customer.address1,
        address2: customer.address2,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        fullAddress: smartJoin([
            customer.address1,
            customer.address2,
            customer.city + ', ' +
            customer.state + ' ' +
            customer.zip,
        ], '<br>'),
        phone: customer.phone,
        orders: customer.getOrders().map((order) => {
            return {
                orderNumber: order.orderNumber,
                date: order.date,
                status: order.status,
                url: '/orders/' + order.orderNumber
            }
        })
    }
}
// 得到一个客户视图模型
function getCustomerViewModel(customerId) {
    var customer = Customer.findById(customerId);
    if(!customer) return { error: 'Unknown customer ID: ' + req.params.customerId };
    var orders = customer.getOrders().map((order) => {
        return {
            orderNumber: order.orderNumber,
            date: order.date,
            status: order.status,
            url: '/orders/' + order.orderNumber
        }
    });
    var vm = _.omit(customer, 'salesNotes');
    return _.extend(vm, {
        name: smartJoin([vm.firstName, vm.lastName]),
        fullAddress: smartJoin([
            customer.address1,
            customer.address2,
            customer.city + ', ' +
            customer.state + ' ' +
            customer.zip,
        ], '<br>'),
        orders: customer.getOrders().map((order) => {
            return {
                orderNumber: order.orderNumber,
                date: order.date,
                status: order.status,
                url: '/orders/' + order.orderNumber
            }
        })
    });
}