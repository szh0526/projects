/**
 * 控制器
 * 负责处理用户交互，并根据用户交互选择恰当的视图来显示
 * 控制器和路由器之间唯一的区别是控制器一般会把相关功能归组
 */
import {model,getAll,find,insert,update,remove} from '../models/vacation.js';
import {defaultJson,getAllVacations,getVacation} from '../viewModels/vacation.js';

module.exports = {
    registerRoutes(app) {
        const _self = this;
        app.get('/vacations', _self.findVacation);
        app.get('/vacations/del', _self.delVacation);
        app.get('/vacations/update', _self.updateVacation);
        app.get('/set-currency/:currency', _self.setcurrency);
    },
    setcurrency(req,res){
        //设置货币session 由expresssession获取
        req.session.currency = req.params.currency;
        return res.redirect(303, '/vacations');
    },
    getAllVacations(req, res, next){
        var vacations = getAll({ name: new RegExp(".*测试") });
        if(!vacations) return next(); // 将这个传给404 处理器

        var currency = req.session.currency || 'USD';
        switch(currency){
            case 'USD': context.currencyUSD = 'selected'; break;
            case 'GBP': context.currencyGBP = 'selected'; break;
            case 'BTC': context.currencyBTC = 'selected'; break;
        }
        res.render('vacations', getAllVacations(vacations));
    },
    findVacationById(id) {
        var vacation =null;
        if(!id) return vacation;
        vacation = find(id);
        if(vacation) return vacation;
    },
    insertVacation(req, res, next){
        let vacation = insert({
            name: '测试5',
            slug: '测试5',
            category: '测试5',
            sku: 'HR199',
            description: '测试5!',
            priceInCents: 9995,
            tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
            inSeason: true,
            maximumGuests: 16,
            available: true,
            packagesSold: 0,
            updateId: (new Date).getTime()
        });
        if(!vacation) res.json(defaultJson("0019990001","添加失败"));
        res.json({
            success: true
            ,errorCode:""
            ,errorMsg:"添加成功!"
            ,data:{}
        });
    },
    updateVacation(req, res, next){
        let vacation = update({_id: req.body.id}, {available: true})
        if(!vacation) res.json(defaultJson("0019990002","更新失败"));
        res.json({
            success: true
            ,errorCode:""
            ,errorMsg:"更新成功!"
            ,data:{}
        });
    },
    delVacation(req, res, next){
        let vacation = delete({_id: req.body.id});
        //defaultJson 改成es6继承类
        if(!vacation) res.json(defaultJson("0019990003","删除失败"));
        res.json({
            success: true
            ,errorCode:""
            ,errorMsg:"删除成功!"
            ,data:{}
        });
    }
}
