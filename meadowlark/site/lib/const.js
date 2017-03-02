/**
 * 常量模块
 * import enumsConfig as enum from './consts';
 * 在全局环境，不应该设置变量，只应设置常量，并且编译器会对const进行优化吗，提高运行效率
 * //best写法 const [a, b, c] = [1, 2, 3];
 */
const u_key = 'es6'
const EnumsConfig = {
    admin_username,
    admin_password,
    mongodb:{
        uri:''
    },
    order_status:{
        A:0,
        B:1,
        C:2,
    },
    user:{name:'',pwd:''},
    [u_key + "status"]:{
        a:1,
        b:2,
    },
    reversefn(value){
        return value;
    },
    concatenateAll(...args) {
        return args.join('');
    }
};

export default EnumsConfig