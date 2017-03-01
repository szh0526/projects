let _ = require('lodash');

/**
 * 默认json数据
 * @param  code     错误码
 * @param  msg      错误信息
 * @param  success  成功状态
 * @param  data     数据
 * @return json     视图模型
 */
let defaultJson = (code = "0019990000",msg = "接口异常",success = false,data = {}) => {
    return {success: success,errorCode:code,errorMsg:msg,data:data}
}


/**
 * 获取全部
 * @param  attraction 实体
 * @return vm         视图模型
 */
let getAllVacation = (vacations,currency = 'USD') => {
    var context = {
        vacations:[]
    }
    switch(currency){
        case 'USD': context.currencyUSD = 'selected'; break;
        case 'GBP': context.currencyGBP = 'selected'; break;
        case 'BTC': context.currencyBTC = 'selected'; break;
    }
    if(!vacations || vacations.length == 0) return context;
    context.vacations = vacations.map((vacation) => {
        var vm = _.omit(vacation, 'available');
        return _.assign(vm, {
            id:vm._id,
            name: vm.name,
            description: vm.description,
            slug: vm.slug,
            category: vm.category,
            sku: vm.sku,
            inSeason: vm.inSeason,
            price: 0.00,
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
let getVacation = (vacations) => {
    if(!vacations || vacations.length == 0) return {};
    let arrs = vacations.map((vacation) => {
        var vm = _.omit(vacation, 'available');
        return _.assign(vm, {
            id:vm._id,
            name: vm.name,
            description: vm.description,
            slug: vm.slug,
            category: vm.category,
            sku: vm.sku,
            tags: vm.tags,
            priceInCents: vm.priceInCents,
            inSeason: vm.inSeason,
            qty: vm.qty
        });
    })
    //取第一个
    return _.head(arrs);
}



export {
    defaultJson,
    getAllVacation,
    getVacation
};