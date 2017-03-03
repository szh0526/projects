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