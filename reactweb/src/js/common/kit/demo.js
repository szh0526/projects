//////////////////////////////////////////////////////////////////////////////////
//                                  class类
//////////////////////////////////////////////////////////////////////////////////

//Symbol值的唯一性
const bar = Symbol('bar');
const snaf = Symbol('snaf');
let Point =new class{
  constructor(name) {
    this.name = name;
    this.printName = (name = 'there') => {
        this.print(`Hello ${name}`);
    };
  }

  print(text) {
    console.log(text);
  }

  sayName() {
    console.log(this.name);
  }

  // 公有方法
  foo(baz){
    this[bar](baz);
  }

  [bar](baz){
      return this[snaf]=baz;
  }

}("孙哈哈")


/*Point.sayName();
Point.foo(1111);
console.log("1:"+Point[snaf]);

const {printName} = Point;
printName();*/

class testExtends {
    constructor(name){
        if (new.target === testExtends) {
            throw new Error('本类不能实例化');
        }
        this.name= name;
    }
    //在类上调用,而不是在实例上调用 子类可以继承父类的静态方法
    static staticFun(){
        console.log("静态方法");
    }

    toString(){
        return this.name;
    }
}

class ColorPoint extends testExtends {
    constructor(name,color){
        //表示父类的构造函数，新建父类的this
        super(name);
        //类不能被实例化，只能用于继承
        if (new.target !== ColorPoint) {
            throw new Error('必须使用new生成实例');
        }
        this.color = color;
    }
    //类的静态属性
    static status = 32;

    //类的实例属性
    status = 11;

    toString(){

        console.log(this.color + " "+ super.toString());
        return this.color + " "+ super.toString();// 调用父类原型方法 子类不能调用父类的实例属性
    }
}
ColorPoint.staticFun();
console.log(ColorPoint.status)
var cp = new ColorPoint("测试","blue");
cp.toString();
console.log(cp.status);

var person = new ColorPoint("测试","blue"); // 正确
/*var notAPerson = ColorPoint.call(person, "测试","blue");  // 报错*/

//////////////////////////////////////////////////////////////////////////////////
//                                  Symbol
//////////////////////////////////////////////////////////////////////////////////
var type = {
        type1: Symbol(`type1`),
        type2: Symbol(`type2`),
        [Symbol(`type3`)]:`123`,
    };
var s2 = Symbol(`bar`);

console.log(s2.toString());
console.log(Symbol() === Symbol())
console.log(type.type1)

var objectSymbols = Object.getOwnPropertySymbols(type);
//Reflect.ownKeys: Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。
console.log(Reflect.ownKeys(type));
/*console.log(objectSymbols)*/

var s1 = Symbol.for("foo");
console.log(Symbol.keyFor(s1))

//////////////////////////////////////////////////////////////////////////////////
//                                  Set和Map数据结构
//////////////////////////////////////////////////////////////////////////////////
var set = new Set([1,2,2,3,4])
console.log(set);
console.log([...set]);
console.log([...new Set(undefined)]);
console.log([...new Set(undefined)].size);
const s = new Set();
s.add(1).add(2).add(2);
console.log(s.size)
console.log(s.has(1))
console.log(s.delete(2))

var a = [...set].map(x => x * 2);
console.log(a);


let map = new Map();
map.set(1, 'aaa').set(1, 'bbb');
console.log(map.get(1))

let map1 = new Map();
map1.set('foo', 123).set('bar', 321);
console.log(map1.size);
console.log(map1.get('foo'));
console.log(map1.has('foo'));
console.log(map1.delete('bar'));
/*map1.clear();
console.log(map1.size);*/
for (let [key, value] of map1.entries()) {
  console.log(key, value);
}

//////////////////////////////////////////////////////////////////////////////////
//                                  Iterator和for...of循环
//////////////////////////////////////////////////////////////////////////////////
let obj = {
    *[Symbol.iterator](){
        yield 1;
        yield 2;
        yield 3;
    }
}
for(let x of obj){
    console.log(x);
}
var arrs = [1,2,3,4,5];
arrs.forEach(function(element,index) {
    console.log(element,index);
});


//////////////////////////////////////////////////////////////////////////////////
//                                  Reflect Reflect可代替部分Object扩展方法
//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//                                  Proxy
//////////////////////////////////////////////////////////////////////////////////

//Proxy 对象设一层“拦截”，访问该对象都必须先通过这层拦截（过滤和改写）
class testProxy {
    value=1;
    appp=2;
    _test=0;
    _test1=1;

    constructor(name){
        this.name= name;
    }
    static staticFun(){
        console.log("静态方法");
    }

    toString(){
        return this.name;
    }
}

//属性带_下划线属于私有属性
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

//proxy 过滤一些对类的操作  proxy中赋值 取值之类的操作可以用reflect
var proxyObj = new Proxy(testProxy, {
  //拦截对象属性的读取，比如proxy.foo和proxy['foo']。
  get(target, key) {
    invariant(key, 'get');
    if (key in target) {
      return Reflect.get(target, key);
    } else {
      throw new ReferenceError("Property \"" + key + "\" does not exist.");
    }
  },
  //拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
  set(target, key, value) {
    invariant(key, 'set');
    return Reflect.set(target, key, value);
  },
  //拦截delete proxy[propKey]的操作，返回一个布尔值。
  deleteProperty(target, key){
    invariant(key, 'delete');
    return true;
  },
  construct(target, args) {
    console.log('called: ' + args.join(', '));
    return {value:args[0]};
  },
  ownKeys (target) {
    return Reflect.ownKeys(target).filter(key => key[0] !== '_');
  }
});

/*
proxyObj.value = 1;
++proxyObj.value;
"value" in proxyObj;
//delete proxyObj.value;
new proxyObj(1,2,3,4,5);
//delete proxyObj._value;

for (let key of Object.keys(proxyObj)) {
  console.log(key);
}*/


//////////////////////////////////////////////////////////////////////////////////
//                                  Promise
//////////////////////////////////////////////////////////////////////////////////
//三种状态：Pending（进行中）、成功：Resolved（已完成，又称 Fulfilled）和失败：Rejected（已失败）

//Promise实例创建立即执行
let promise = new Promise(function(resolve, reject) {
    if(false){
        resole();
    }else{
        reject(new Error('失败'))
    }
});

//parm1:Resolved回调，parm2:Reject回调(非必须)
//同步任务执行完才执行
promise.then(function(value) {
  console.log('Resolved.');
}, function(error) {
  console.log('Rejected.');
});

//p1的状态决定了p2的状态  p1状态是pending则p2等待p1的状态,p1的状态是Resolved或Rejected，p2会立刻执行
//promise第一个回调返回promiseA对象可以再then回调接收promiseA的状态处理
//由于p1返回的是reject状态所以p2接收到p1状态返回error
//then的rejected回调不建议传由catch自动捕获

/*getJSON("./config.json")
.then(post => getJSON("./config.json"))
.then(comments => console.log("Resolved: ", comments))
.catch(error => {
    //任何一个then抛出的错误都会被catch捕捉
    // 捕获运行中抛出的错误(如then方法中抛出 throw new Error('test')会被catch捕获)
    console.log('发生错误！', error);
});*/


//Promise.resolve()  //Promise.resolve将现有对象转为Promise对象 状态为resolve
//Promise.reject()  //Promise.reject将现有对象转为Promise对象 状态为reject

//////////////////////////////////////////////////////////////////////////////////
//                                  Generator
//////////////////////////////////////////////////////////////////////////////////
//Generator函数存在next何时执行问题,更好的控制next需要co模块Generator函数 或者用async自执行
//Generator函数的执行必须靠执行器，所以才有了co模块

//Generator是一个状态机,封装了多个内部状态
//调用next会返回{value:'',done:true};
function* generator() {
  yield console.log(1);
  yield console.log(2);
  return 'ending';
}

var hw = generator();
hw.next();
hw.next();
console.log(hw.next());

var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

console.log([...myIterable]);


function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
console.log([...numbers()]) // [1, 2]

// Array.from 方法
console.log(Array.from(numbers())) // [1, 2]

// 解构赋值
let [x, y] = numbers();
console.log(x) // 1
console.log(y) // 2

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2


function* foo1() {
  yield 'a';
  yield 'b';
}

function* bar1() {
  yield 'x';
  yield* foo1();
  yield 'y';
}
//  yield* foo1(); 相当于 执行x  a  b y
for (let v of bar1()){
  console.log(v);
}

//生成一个空对象，使用call方法绑定Generator函数内部的this。空对象就是Generator函数的实例对象
function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

function F() {
  return gen.call(gen.prototype);
}

var f = new F();

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3


/*function* run(){
    yield aPromise();
    yield bPromise();
}

var run = run();
run.next();
run.next();*/


/*function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

var it = main();
it.next();*/


function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };
for (let [key, value] of iterEntries(myObj)) {
    console.log(key, value);
}


//////////////////////////////////////////////////////////////////////////////////
//                                  async
//////////////////////////////////////////////////////////////////////////////////

//1.Generator自执行必须靠执行器(co模块),async函数自带执行器。
//2.Generator  * 和yield
function* gen(){
    yield 1;
    return;
}

let ps = new Promise(function(resolve, reject) {
    if(true){
        resole();
    }else{
        reject(new Error('失败'))
    }
});
//async async await
var gen1 = async function(){
    await ps;
}

//3.await  后是Promise或Thunc函数属异步  如果是数组，字符串等属于同步
//4.返回值是 Promise

//只要一个await后 Promise 变reject，整个async函数都中断执行


function promise1(){
    return new Promise((resolve,reject) => {
        //返回json结果
        var data = {};
        resolve(data);
    });
}
function promise2(){
    return new Promise((resolve,reject) => {
        var data = {}
        resolve(data);
    });
}

function promise3(){
    return new Promise((resolve,reject) => {
        throw new Error('异常promise')
    });
}

//await后异步操作出错等同于async函数返回的 Promise 对象被reject。
//确认Promise结果
async function fun1(){
    try{
        var val1 = await firstStep();
        var val2 = await secondStep(val1);
        var val3 = await thirdStep(val1, val2);
    }catch(e){
        throw new Error('Promise 对象被reject')
    }

    await promise1();
}


/*async function fun2() {
  await promise3()
  .catch(function (err) {
    console.log(err);
  };
}*/


fun1()
.then(
    v=>console.log(1),
    e=>console.log(2)
)
.catch(function(e){
    //捕获fun1中的 error
    console.log(e);
});

//互不依赖的俩个Promise可以用Promise.all同时触发
//let [foo, bar] = await Promise.all([promise1(), promise2()]);
