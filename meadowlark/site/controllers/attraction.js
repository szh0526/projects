/**
 * 控制器
 * 负责处理用户交互，并根据用户交互选择恰当的视图来显示
 * 控制器和路由器之间唯一的区别是控制器一般会把相关功能归组
 */
var Attraction = require('../models/attraction.js');
var attractionViewModel = require('../viewModels/attraction.js');

exports = {
    //把路由整理在一起更清晰
    registerRoutes: (app) => {
        const _self = this;
        app.get('/attractions/search',_self.getAllAttractions);
        app.get('/attractions/operate/:id',_self.findAttractionById);
        app.get('/api/attraction/findById', _self.findAttractionById);
/*        app.post('/api/attraction/insert', attractionApi.insertAttraction);
        app.post('/api/attraction/update', attractionApi.updateAttraction);
        app.post('/api/attraction/delete/:id', attractionApi.delAttraction);*/
    },
    //查询全部
    getAllAttractions: function(req, res, next){
        const _self = this;
        var customer = _self.findAttractionById(req.params.id);
        if(!customer) return next(); // 将这个传给404 处理器
        res.render('customer/home', attractionViewModel(customer));
    },
    //根据id查找
    findAttractionById:(id) => {
        var customer =null;
        if(!id) return customer;
        customer = Attraction.findById(id);
        if(customer) return customer;
    }
}