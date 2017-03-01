/**
 * 控制器
 * 负责处理用户交互，并根据用户交互选择恰当的视图来显示
 * 控制器和路由器之间唯一的区别是控制器一般会把相关功能归组
 */
import {getAll,find,insert,update,remove} from '../models/attraction.js';
import {defaultJson,getAllAttraction,getAttraction} from '../viewModels/attraction.js';

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
        getAll()
        .then(function(result){
            res.render('attractions/search', getAllAttraction(result));
        }).catch(function(err){
            console.log(err);
            next(); // 将这个传给404 处理器
        })
    },
    findAttraction(req, res, next){
        if(!req.params.id){
            res.render('attractions/operate', {});
        }else{
            find(req.params.id)
            .then(function(result){
                res.render('attractions/operate', getAttraction(result));
            }).catch(function(err){
                console.log(err);
                next(); // 将这个传给404 处理器
            });
        }
    },
    insertAttraction(req, res, next){
        insert({
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
        }).then(function(result){
            res.json(defaultJson("","添加成功",true,result));
        }).catch(function(err){
            res.json(defaultJson("0019990001","添加失败"));
        });
    },
    updateAttraction(req, res, next){
        update({_id: req.body.id},
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
        }).then(function(result){
            res.json(defaultJson("","更新成功",true,result));
        }).catch(function(err){
            res.json(defaultJson("0019990002","更新失败"));
        });
    },
    delAttraction(req, res, next){
        var id = req.params.id;
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