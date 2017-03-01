/**
 * 控制器
 * 负责处理用户交互，并根据用户交互选择恰当的视图来显示
 * 控制器和路由器之间唯一的区别是控制器一般会把相关功能归组
 */
import {getAll,find,insert,update,remove} from '../models/vacation.js';
import {defaultJson,getAllVacation,getVacation} from '../viewModels/vacation.js';

export default {
    registerRoutes(app){
        const _self = this;
        app.get('/vacations', _self.getAllVacations);
        app.get('/set-currency/:currency', _self.setcurrency);
        app.get('/api/vacation/insert', _self.insertVacation);
        app.get('/api/vacation/update', _self.updateVacation);
        app.get('/api/vacation/del', _self.delVacation);
    },
    setcurrency(req,res){
        //设置货币session 由expresssession获取
        req.session.currency = req.params.currency;
        return res.redirect(303, '/vacations');
    },
    getAllVacations(req, res, next){
        getAll()
        .then(function(result){
            res.render('vacations', getAllVacation(result,req.session.currency));
        }).catch(function(err){
            console.log(err);
            next(); // 将这个传给404 处理器
        });
    },
    insertVacation(req, res, next){
        insert({
            name: '测试' + (new Date).getTime(),
            slug: '测试' + (new Date).getTime(),
            category: '测试' + (new Date).getTime(),
            sku: 'HR199',
            description: '测试' + (new Date).getTime(),
            priceInCents: 9995,
            tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
            inSeason: true,
            maximumGuests: 16,
            available: true,
            packagesSold: 0,
            updateId: (new Date).getTime()
        }).then(function(result){
            res.json(defaultJson("","添加成功",true,result));
        }).catch(function(err){
            res.json(defaultJson("0019990001","添加失败"));
        });
    },
    updateVacation(req, res, next){
        update({_id: "58b6644669b14bb081d11d82"},{available: false})
        .then(function(result){
            res.json(defaultJson("","更新成功",true,result));
        }).catch(function(err){
            res.json(defaultJson("0019990002","更新失败"));
        });
    },
    delVacation(req, res, next){
        var id = "58b6642469b14bb081d11d7f";
        find(id)
        .then(function(result){
            if(result && result.length > 0){
                remove(id)
                .then(function(result){
                    res.json(defaultJson("","删除成功",true,result));
                }).catch(function(err){
                    res.json(defaultJson("0019990003","删除失败"));
                });
            }else{
                res.json(defaultJson("0019990004","该记录不存在"));
            }
        }).catch(function(err){
            throw new Error('服务器异常:' + err);
        });
    }
}
