/**
 * Created by sunzehao on 2016/11/25.
 * 度假处理器
 */

var Vacation = require('../models/vacation.js');
var config = require('../lib/config.js');

//查询数据
exports.find = function(req, res){
    //添加数据
    Vacation.find(function(err, vacations){
        if(vacations.length) return;
        new Vacation({
            name: '测试1',
            slug: '测试1',
            category: '测试1',
            sku: 'HR199',
            description: '测试1测试1测试1测试1!',
            priceInCents: 9995,
            tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
            inSeason: true,
            maximumGuests: 16,
            available: true,
            packagesSold: 0
        }).save();
        new Vacation({
            name: '测试2',
            slug: '测试2',
            category: '测试2',
            sku: 'OC39',
            description: '测试2测试2测试2测试2测试测试1',
            priceInCents: 269995,
            tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
            inSeason: false,
            maximumGuests: 8,
            available: true,
            packagesSold: 0
        }).save();
        new Vacation({
            name: '测试3',
            slug: '测试3',
            category: '测试3',
            sku: 'B99',
            description: '测试3测试3测试3测试3测试3测试3',
            priceInCents: 289995,
            tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
            inSeason: true,
            requiresWaiver: true,
            maximumGuests: 4,
            available: false,
            packagesSold: 0,
            notes: '测试3测试3测试3测试3测试3测试3测试3测试3测试3测试3测试3测试3'
        }).save();
    });
    //模糊查询
    Vacation.find({ name: new RegExp(".*测试") }, function(err, vacations){
        var currency = req.session.currency || 'USD';
        //只映射给视图需要展示的数据
        var context = {
            currency: currency,
            vacations: vacations.map(function(vacation){
                return {
                    sku: vacation.sku,
                    name: vacation.name,
                    description: vacation.description,
                    inSeason: vacation.inSeason,
                    price: config.convertFromUSD(vacation.priceInCents/100, currency),
                    qty: vacation.qty
                }
            })
        };
        switch(currency){
            case 'USD': context.currencyUSD = 'selected'; break;
            case 'GBP': context.currencyGBP = 'selected'; break;
            case 'BTC': context.currencyBTC = 'selected'; break;
        }
        res.render('vacations', context);
    });
};

//删除数据
exports.del = function(req, res){
    Vacation.remove({_id:"5837b40fdd0b02251415a5e0"},function(err,result){
        if(err){
            console.log("Error:" + err);
        }else{
            console.log("删除成功");
        }
    });
    res.redirect(303,'/vacations');
};

//更新数据
exports.update = function(req, res){
    //查询条件
    var wherestr = {name:"测试3"};
    //更新字段
    var updatestr = {available: true};
    Vacation.update(wherestr, updatestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("更新成功");
        }
    })

    res.redirect(303,'/vacations');
};

//设置币种
exports.setcurrency = function(req,res){
    //设置货币session 由expresssession获取
    req.session.currency = req.params.currency;
    return res.redirect(303, '/vacations');
}

