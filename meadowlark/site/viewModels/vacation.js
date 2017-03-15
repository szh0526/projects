let _ = require('lodash');

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
    getAllVacation,
    getVacation
};