/**
 * Proxy 拦截器基础配置
 * Proxy控制了外部对对象的访问
 * target 是被代理的对象，handlder 是声明了各类代理操作的对象，最终返回一个代理对象。
 * 注：proxy中赋值,取值等操作用Reflect API
 * Proxy 的核心作用是控制外界对被代理者内部的访问，Decorator 的核心作用是增强被装饰者的功能。
 * 例: var proxyObj = new Proxy(Attraction, handler);
 */

/**
 * 是否私有属性 _key
 */
let isPrivate = (key, action) => {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

/**
 * 日志
 */
let logMethodAsync = (timestamp, method) => {
  setTimeout(function() {
      console.log(`${timestamp} - 请求日志 ${method}.`);
  }, 0)
}

export default function(target){
    return new Proxy(target, {
        //拦截Proxy实例作为构造函数调用的操作
        construct(target, args) {
          console.log('called: ' + args.join(', '));
          return {value:args[0]};
        },
        //拦截属性获取
        get(target, key) {
          if (!Reflect.has(target, key)) return;
          isPrivate(key, 'get');
          logMethodAsync(new Date(), key);
          return Reflect.get(target, key);
        },
        //拦截属性赋值
        set(target, key, value) {
          isPrivate(key, 'set');
          return Reflect.set(target, key, value);
        },
        //拦截属性delete
        deleteProperty(target, key){
          isPrivate(key, 'delete');
          return Reflect.deleteProperty(targer,key);
        },
        //拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)
        //返回目标对象所有自身的属性的属性名
        ownKeys (target) {
          return Reflect.ownKeys(target).filter(key => key[0] !== '_');
        }
    })
}