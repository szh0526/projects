/**
 * es6公共方法
 * 与commonjs差异
 * commonjs require时执行,只在第一次加载时运行一次,再加载都是缓存
 * ES6 模块是编译时输出接口，在代码运行之前，调用时动态加载
 * ES6模块顶层this指向undefined；CommonJS 模块顶层this指向当前模块
 * Node中commonjs 和 es6模块分别加载
 * es6 import commonjs模块
 * import * as express from 'express';
 * const app = express.default();  express.default即module.exports
 * require命令加载es6模块时,所有输出接口，会成为输入对象的属性
 * // es.js  export let foo = {bar:'my-default'};
 * // cjs.js const es_namespace = require('./es');   es_namespace = {get foo() {return foo;}}
 */

/**
* 使用Proxy，获取方法的时候，自动绑定this
* const { printName } = logger; 解决单独使用方法时this指向的问题
* 或者在constructor构造函数中，用箭头函数解决this指向
* 例:const logger = selfish(new Logger());
*    const { printName } = logger;
*    printName();
*/
function selfish (target) {
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

/**
 * Mixin模式指的是，将多个对象合成为一个类
 * 例：class C extends mix(A, B) {}
 */
function mix(...mixins) {
  class Mix {}

  for (let mixin of mixins) {
    copyProperties(Mix, mixin);
    copyProperties(Mix.prototype, mixin.prototype);
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== "constructor"
      && key !== "prototype"
      && key !== "name"
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}

/**
 * 修饰器mixins，把Foo类的方法添加到了MyClass的实例上面
 * 例: @mixins(Foo)
 *     class MyClass {}
 *     let obj = new MyClass();
 *     obj.foo() // 'foo'
 */
let mixins = (...list) => (target) => Object.assign(target.prototype, ...list);

/**
 * 类似数组的追加
 * spreadable false不可展开   true可展开
 * 类似数组:let obj = {length: 2, 0: 'c', 1: 'd'};
 * var newarr = concatSpreadable([a,b],obj,true)
 */
let concatSpreadable = (head,tail,spreadable = false) => {
    tail[Symbol.isConcatSpreadable] = spreadable;
    return head.concat(tail);
}

/**
 * 数组去重
 */
let unique = (array) => [...new Set(array)];

/**
 * 数组去重
 */
let dedupe = (array) => Array.from(new Set(array));


/**
 * 数组并集
 * @param  [] a
 * @param  [] b
 * @return []
 */
let union = (a,b) => {
    let seta = new Set(a),setb = new Set(b);
    return [...new Set([...seta, ...setb])];
}

/**
 * 数组交集
 * @param  [] a
 * @param  [] b
 * @return []
 */
let intersect = (a,b) => {
    let seta = new Set(a),setb = new Set(b);
    return [...new Set([...a].filter(x => b.has(x)))];
}

/**
 * 数组差集
 * @param  [] a
 * @param  [] b
 * @return []
 */
 let difference = (a,b) =>{
    let seta = new Set(a),setb = new Set(b);
    return [...new Set([...a].filter(x => !b.has(x)))]
 }

/**
 * 转换map对象 并返回map
 * @param  Map map
 * @param  函数 fn
 * @return Map对象
 */
let transMap = (map,fn) => new Map([...map].filter(fn));

/**
 * 转换map对象为数组
 * @param  Map map
 * @return []
 */
let mapToArr = (map) => [...map];

/**
 * 转换map对象为数组
 * @param  Map map
 * @return []
 */
let arrToMap = (arr) => new Map(arr);

/**
 * Map转为对象
 * @param  Map 键都是字符串的Map
 * @return Object
 */
 let strMapToObj = (strMap) => {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        obj[k] = v;
    }
    return obj;
}

/**
 * 对象转为Map
 * @param  Object
 * @return Map
 */
let objToStrMap = (obj) => {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

/**
 * map转为Json
 * @param  Object 键都是字符串的Map
 * @return Json
 */
let strMapToJson = (strMap) => JSON.stringify(strMapToObj(strMap));

/**
 * map转数组JSON
 * @param  Map 键有非字符串
 * @return ArrayJson
 */
let mapToArrayJson = (map) => JSON.stringify([...map]);

/**
 * JSON转为Map
 * @param  Json
 * @return Map
 */
let jsonToStrMap = (jsonStr) => objToStrMap(JSON.parse(jsonStr));

/**
 * 数组JSON转为Map
 * @param  Json
 * @return Map
 */
let arrJsonToMap = (jsonStr) => new Map(JSON.parse(jsonStr));
