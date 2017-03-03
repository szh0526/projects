/**
 * 常量模块
 * import enumsConfig as enum from './consts';
 * 在全局环境，不应该设置变量，只应设置常量，并且编译器会对const进行优化吗，提高运行效率
 * //best写法 const [a, b, c] = [1, 2, 3];
 */
const u_key = `es6`;
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
    [`status${u_key}`]:{
        a:1,
        b:2,
    },
    //消除魔术字符串 将多处使用的字符串改成变量控制
    type {
        type1: Symbol(`type1`),
        type2: Symbol(`type2`),
        //每次都会创建新的symbol
        [Symbol(`type3`)]:`123`,
        //校验是否存在该symbol，有则返回，没有新建
        [Symbol.for('type4')]:`456`,
    },
    reversefn(value){
        return value;
    },
    concatenateAll(...args) {
        return args.join('');
    }
};

export default EnumsConfig