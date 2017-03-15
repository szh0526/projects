/**
 * CRUD操作基类
 */
import {error} from '../../lib/consts';

export default class BaseClass{
    /**
     * 构造器
     * @param model 数据库操作对象
     */
    constructor(model){
        if (new.target === BaseClass)
            throw new Error('BaseClass不能独立使用,必须继承后才能使用');
        if(!model)
            throw new Error('未初始化mongooseschema实例');
        //Object.assign(this,model);
        this.model = model;
    }

    /**
     * 默认json数据
     * @param  code     错误码
     * @param  msg      错误信息
     * @param  success  成功状态
     * @param  data     数据
     * @return json     视图模型
     */
    defaultJson(code = "0019990000",success = false,data = {}){
        return {
            success: success,
            errorCode:code,
            errorMsg:error[code],
            data:data
        };
    }

    /**
     * 获取全部
     * @return [] 实体数组
     */
    getAll(){ return this.model.find({}) }

    /**
     * 根据id查找
     * @param id  记录id
     * @return [] 实体数组
     */
    find(id){ return this.model.find({_id: id}) }

    /**
     * 新增
     * @param model 实体
     * @return {} 实体对象
     */
    insert(model){ return new this.model(model).save() }

    /**
     * 更新
     * @param wherestr 更新条件
     * @param model 实体
     * @return {} 实体对象
     */
    update(wherestr, model){ return this.model.update(wherestr, model) }

    //删除
    /**
     * 更新
     * @param id  记录id
     * @return {} 实体对象
     */
    remove(id){ return this.model.remove({_id: id}) }
}