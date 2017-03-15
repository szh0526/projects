let _ = require('lodash');

/**
 * 根据id获取
 * @param  vm 实体
 * @return vm         视图模型
 */
let getAttraction = (attractions) => {
    if(!attractions || attractions.length == 0) return {};
    let arrs = attractions.map((attraction) => {
        let vm = _.omit(attraction, 'updateId');
        return _.assign(vm, {
            id:vm._id,
            name: vm.name,
            description: vm.description,
            location:vm.location,
            history:vm.history
        });
    })
    return _.head(arrs);
}


/**
 * 获取全部
 * @param  attraction 实体
 * @return vm         视图模型
 */
let getAllAttraction = (attractions) => {
    var context = {
        attractions:[]
    }
    if(!attractions || attractions.length == 0) return context;
    context.attractions = attractions.map((attraction) => {
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


export {
    getAllAttraction,
    getAttraction
}