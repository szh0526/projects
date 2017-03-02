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
function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list);
  };
}