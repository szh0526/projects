/**
 * 控制器
 * 负责处理用户交互，并根据用户交互选择恰当的视图来显示
 * 控制器和路由器之间唯一的区别是控制器一般会把相关功能归组
 */
import model from '../models/vacation.js';
import {getAllVacation,getVacation} from '../viewModels/vacation.js';

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
        model.getAll()
        .then(result => res.render('vacations', getAllVacation(result,req.session.currency)))
        .catch(err => next());
    },
    insertVacation(req, res, next){
        model.insert({
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
        })
        .then(result => res.json(model.defaultJson("0019990001",true,result)))
        .catch(err => res.json(model.defaultJson("0019990002")));
    },
    updateVacation(req, res, next){
        model.update({_id: "58b6644669b14bb081d11d82"},{available: false})
        .then(result => res.json(model.defaultJson("0019990003",true,result)))
        .catch(err => res.json(model.defaultJson("0019990004")));
    },
    delVacation(req, res, next){
        let id = "58b6644669b14bb081d11d82";

        let errfn = err => {
            throw new Error(err);
        }

        model.find(id)
        .then(result => {
            return result;
        },errfn)
        .then(result => {
            if(result && result.length > 0){
                return model.remove(result[0]["_id"]);
            }
            return;
        },errfn)
        .then(result => {
            if(!result || typeof(result) === 'undefined'){
                res.json(model.defaultJson("0019990007"));
                return;
            }
            if(result.result && result.result.ok == 1){
                res.json(model.defaultJson("0019990005"));
            }else{
                res.json(model.defaultJson("0019990006"));
            }
        },errfn)
        .catch(err => {
            res.json(model.defaultJson())
        });
    }
}
