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
var notAPerson = ColorPoint.call(person, "测试","blue");  // 报错