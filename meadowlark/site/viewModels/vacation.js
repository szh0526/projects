let Vacation = require('../models/attraction.js');
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
 * @param  vacation   实体
 * @return vm         视图模型
 */
exports.getAllVacations = function(vacations) {
   var context = {
        vacations:[]
    }
    if(!vacations || vacations.length == 0) return context;
    context.vacations = vacations.map((vacation) => {
        var vm = _.omit(vacation, 'updateId');
        return _.assign(vm, {
            id:vm._id,
            sku: vm.sku,
            name: vm.name,
            description: vm.description,
            inSeason: vm.inSeason,
            price: 0.00,//config.convertFromUSD(vm.priceInCents/100, currency),
            qty: vm.qty
        });
    })
    return context;
}


/**
 * 根据id获取
 * @param  id
 * @return vm
 */
exports.getVacation = function(id) {
    var vacation = Vacation.findById(id);
    if(!vacation) return null;
    //排除available属性
    var vm = _.omit(vacation, 'available');
    //assign和extend都是合并对象
    return _.assign(vm, {
        id:vm._id,
        name: vm.name,
        description: vm.description,
        slug: vm.slug,
        category: vm.category,
        sku: vm.sku,
        priceInCents: vm.priceInCents,
        tags: vm.tags,
        inSeason: vm.inSeason
    });
}