let Attraction = require('../models/attraction.js');

function AttractionApi(){
}
AttractionApi.prototype = {
    constructor: AttractionApi
    ,
    //查询全部
    getAllAttractions(req,res,next){
        Attraction.find({
            approved: false
        }, (err, attractions) => {
            if(err) res.send(500, 'Error occurred: database error.');
            //只映射给视图需要展示的数据
            var context = {
                attractions: attractions.map((attraction) => {
                    return {
                        id:attraction._id,
                        name: attraction.name,
                        description: attraction.description,
                        location: attraction.location,
                        history:attraction.history,
                        approved: attraction.approved
                    }
                })
            };
            res.render('attractions/search',context);
        });
    },
    //es6简写属性
    getAttractionById(req,res){
        var wherestr = {_id: req.params.id};
        Attraction.find(wherestr,(err, attractions) => {
            if(err) res.send(500, 'Error occurred: database error.');
            //只映射给视图需要展示的数据
            var context = {
                attractions: attractions.map((attraction) => {
                    console.log(attraction)
                    return {
                        id:attraction._id,
                        name: attraction.name,
                        description: attraction.description,
                        location:attraction.location,
                        history:attraction.history
                    }
                })
            };
            res.render('attractions/operate', context.attractions[0]);
        });
    },
    //根据id查询
    findAttractionById(req, res){
        var wherestr = {id: req.params.id};
        Attraction.find(wherestr,(err, attractions) => {
            if(err) res.send(500, 'Error occurred: database error.');
            //只映射给视图需要展示的数据
            var context = {
                attractions: attractions.map((attraction) => {
                    return {
                        id:attraction._id,
                        name: attraction.name,
                        description: attraction.description,
                        location:attraction.location
                    }
                })
            };
            res.render('/attractions', context);
        });
    },
    //添加
    insertAttraction(req, res){
        let a = new Attraction({
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
        a.save((err,a) => {
            if(err) res.send(500, 'Error occurred: database error.');
            res.json({
                success: true
                ,msg:"添加成功!"
                ,data:{}
            });
        });
    },
    //更新
    updateAttraction(req, res){
        //查询条件
        var wherestr = {_id: req.body.id};
        //更新字段
        var updatestr = {
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
        };
        Attraction.update(wherestr, updatestr, (err, result) => {
            if(err) res.send(500, 'Error occurred: database error.');
            res.json({
                success: true
                ,msg:"更新成功!"
                ,data:{}
            });
        });
    },
    //删除
    delAttraction(req, res){
        Attraction.remove({_id: req.params.id}, (err, result) => {
            if(err) res.send(500, 'Error occurred: database error.');
            res.json({
                success: true
                ,msg:"删除成功!"
                ,data:{}
            });
        });
    }
}

module.exports= AttractionApi;