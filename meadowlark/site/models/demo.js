import BaseClass from './base/baseClass';
import createProxy from './base/baseProxy';
let AttractionModel =


{};
var log = console.log.bind(console);

class Attraction extends BaseClass{
    //类的静态属性
    static status = 0;

    constructor(schema){
        super(schema);
        Object.assign(this,schema);
    }

    affsfs() {
        console.log('stuff');
    }
}

var attraction = new Attraction(AttractionModel);
log(attraction.schema);

var proxyObj = createProxy(Attraction);
/*proxyObj.status;*/

/*log(Object.getPrototypeOf(proxyObj));
log(Object.getOwnPropertyDescriptors(proxyObj));*/