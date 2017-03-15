/**
 * 控制器
 * 负责处理用户交互，并根据用户交互选择恰当的视图来显示
 * 控制器和路由器之间唯一的区别是控制器一般会把相关功能归组
 */
import model from '../models/attraction.js';
import {getAllAttraction,getAttraction} from '../viewModels/attraction.js';

export default {
    registerRoutes(app) {
        const _self = this;
        app.get('/attractions/search',_self.getAllAttractions);
        app.get('/attractions/operate/:id',_self.findAttraction);
        app.get('/attractions/operate',_self.findAttraction);
        app.post('/api/attraction/insert', _self.insertAttraction);
        app.post('/api/attraction/update', _self.updateAttraction);
        app.post('/api/attraction/delete/:id', _self.delAttraction);
    },
    getAllAttractions(req, res, next){
        model.getAll()
        .then(result => res.render('attractions/search', getAllAttraction(result)))
        .catch(err => next());
    },
    findAttraction(req, res, next){
        if(!req.params.id){
            res.render('attractions/operate', {});
        }else{
            model.find(req.params.id)
            .then(result => res.render('attractions/operate', getAttraction(result)))
            .catch(err => next());
        }
    },
    insertAttraction(req, res, next){
        model.insert({
            name: req.body.name,
            description: req.body.description,
            location: {
                lat: req.body.lat
                , lng: req.body.lng
            },
            history: {
                event: 'created',
                notes: '',
                email: req.body.email,
                date: new Date()
            },
            updateId: (new Date).getTime(),
            approved: false
        })
        .then(result => res.json(model.defaultJson("0019990001",true,result)))
        .catch(err => res.json(model.defaultJson("0019990002")));
    },
    updateAttraction(req, res, next){
        model.update({_id: req.body.id},
            {location: {
                lat: req.body.lat
                , lng: req.body.lng
            }
            , name: req.body.name
            , description: req.body.description
            , history: {
                event: 'updated',
                notes: '',
                email: req.body.email,
                date: new Date()
            }
        })
        .then(result => res.json(model.defaultJson("0019990003",true,result)))
        .catch(err => res.json(model.defaultJson("0019990004")));
    },
    delAttraction(req, res, next){
        let id = req.params.id;

        function createPromise(promiseObj,promiseCallback,callback){
            return new Promise((resolve,reject) => {
                promiseObj.then(result => {
                    if(promiseCallback){
                        resolve(promiseCallback)
                    }else{
                        resolve(result)
                    }
                },err => reject(err));
            });
        }

        let removePromise = createPromise(model.remove(id));
        let findPromise = createPromise(model.find(id),removePromise);

        findPromise
        .then(data => {
            res.json(model.defaultJson("0019990005",true,data.result))
        })
        .catch(err => {
            res.json(model.defaultJson("0019990006"))
        });
    }
}