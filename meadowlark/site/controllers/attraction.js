/**
 * 控制器
 * 负责处理用户交互，并根据用户交互选择恰当的视图来显示
 * 控制器和路由器之间唯一的区别是控制器一般会把相关功能归组
 */
import {getAll,find,insert,update,remove} from '../models/attraction.js';
import {defaultJson,getAllAttraction,getAttraction} from '../viewModels/attraction.js';

module.exports = {
    registerRoutes(app) {
        const _self = this;
        app.get('/attractions/search',_self.getAllAttractions);
        app.get('/attractions/operate/:id',_self.findAttraction);
        app.get('/api/attraction/findById', _self.findAttractionById);
        app.post('/api/attraction/insert', _self.insertAttraction);
        app.post('/api/attraction/update', _self.updateAttraction);
        app.post('/api/attraction/delete/:id', _self.delAttraction);
    },
    getAllAttractions(req, res, next){
        var attraction = getAll(req.params.id);
        if(!attraction) return next(); // 将这个传给404 处理器
        res.render('attractions/search', getAllAttraction(attraction));
    },
    findAttraction(req, res, next){
        const _self = this;
        var attraction = _self.findAttractionById(req.params.id);
        if(!attraction) return next(); // 将这个传给404 处理器
        res.render('attractions', getAttraction(attraction));
    },
    findAttractionById(id) {
        var attraction =null;
        if(!id) return attraction;
        attraction = find(id);
        if(attraction) return attraction;
    },
    insertAttraction(req, res, next){
        let attraction = insert({
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
        });
        if(!attraction) res.json(defaultJson("0019990001","添加失败"));
        res.json({
            success: true
            ,errorCode:""
            ,errorMsg:"添加成功!"
            ,data:{}
        });
    },
    updateAttraction(req, res, next){
        let attraction = update(
            {_id: req.body.id}
            , {
                location: {
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
            }
        )
        if(!attraction) res.json(defaultJson("0019990002","更新失败"));
        res.json({
            success: true
            ,errorCode:""
            ,errorMsg:"更新成功!"
            ,data:{}
        });
    },
    delAttraction(req, res, next){
        let attraction = delete({_id: req.params.id});
        if(!attraction) res.json(defaultJson("0019990003","删除失败"));
        res.json({
            success: true
            ,errorCode:""
            ,errorMsg:"删除成功!"
            ,data:{}
        });
    }
}