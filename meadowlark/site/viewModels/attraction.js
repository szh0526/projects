let Attraction = require('../models/attraction.js');
let _ = require('underscore');

/**
 * 默认json数据
 * @param  code     错误码
 * @param  msg      错误信息
 * @param  success  成功状态
 * @param  data     数据
 * @return json     视图模型
 */
exports.defaultJson = (code = "0019990000",msg = "接口异常",success = false,data = {}) => {
    return {success: success,errorCode:code,errorMsg:msg,data:data}
}

/**
 * 根据id获取
 * @param  attraction 实体
 * @return vm         视图模型
 */
exports.getAttraction = function(attraction) {
    var context = {
        attraction:[]
    }
    if(!attraction) return context;
    context.attraction = attraction.map((attraction) => {
        var vm = _.omit(attraction, 'updateId');
        return _.assign(vm, {
            id:vm._id,
            name: vm.name,
            description: vm.description,
            location:vm.location,
            history:vm.history
        });
    })
    return context;
}


/**
 * 获取全部
 * @param  attraction 实体
 * @return vm         视图模型
 */
exports.getAllAttraction = function(attractions) {
    var context = {
        attractions:[]
    }
    if(!attractions || attractions.length == 0) return context;
    context.attraction = attraction.map((attraction) => {
        var vm = _.omit(attraction, 'updateId');
        return _.assign(vm, {
            id:vm._id,
            name: vm.name,
            description: vm.description,
            location:vm.location,
            history:vm.history
        });
    })
    return context;
}