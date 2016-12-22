/**
 * 控制器
 * 负责处理用户交互，并根据用户交互选择恰当的视图来显示
 * 控制器和路由器之间唯一的区别是控制器一般会把相关功能归组
 */
var Customer = require('../models/customer.js');
var customerViewModel = require('../viewModels/customer.js');

exports = {
    //把路由整理在一起更清晰
    registerRoutes: function(app){
        app.get('/customer/:id', this.home);
        app.get('/customer/:id/preferences', this.preferences);
        app.get('/orders/:id', this.orders);
        app.post('/customer/:id/update', this.ajaxUpdate);
    },
    home: function(req, res, next){
        var customer = this.findCustomerById(req.params.id);
        if(!customer) return next(); // 将这个传给404 处理器
        res.render('customer/home', customerViewModel(customer));
    },
    preferences: function(req, res, next){
        var customer = this.findCustomerById(req.params.id);
        if(!customer) return next(); // 将这个传给404 处理器
        res.render('customer/preferences', customerViewModel(customer));
    },
    orders: function(req, res, next){
        var customer = this.findCustomerById(req.params.id);
        if(!customer) return next(); // 将这个传给404 处理器
        res.render('customer/preferences', customerViewModel(customer));
    },
    //ajax更新需要注意服务端的校验
    ajaxUpdate: function(req, res){
        var customer =this.findCustomerById(req.params.id);
        if(!customer) return res.json({error: 'Invalid ID.'});
        if(req.body.firstName){
            if(typeof req.body.firstName !== 'string' ||
                req.body.firstName.trim() === '')
                return res.json({error: 'Invalid name.'});
            customer.firstName = req.body.firstName;
        }
        // 等等……
        customer.save();
        return res.json({success: true});
    },
    findCustomerById:function(id){
        var customer =null;
        if(!id) return customer;
        customer = Customer.findById(id);
        if(customer) return customer;
    }
}