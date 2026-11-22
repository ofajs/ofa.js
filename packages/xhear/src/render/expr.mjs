/**
 * 模板表达式编译器：把模板里写的表达式字符串编译成可重复执行的函数。
 *
 * 与旧实现的本质区别：编译产物**不绑定数据**——模板是每个组件只编译
 * 一次的共享产物，表达式函数在编译期创建一次，运行期通过 call 注入
 * 具体实例的 { data, errCall }。旧版每个实例每个绑定都 new Function
 * 一次，fill 类场景（千项列表）编译开销是实例创建的主要成本。
 *
 * 编译产物用 `with(data)` 注入数据作用域——模板表达式按数据属性名直接
 * 书写（如 {{count * 2}}），这是模板语法的一部分，不能改成解构或前缀
 * 访问（会改变用户的书写语义）。$event 供内联事件表达式使用
 * （如 on:click="count = $event.x"）。
 */
import { dataRevoked } from "../../../stanz/src/public.mjs";

/**
 * @param {string} expr 模板里的表达式原文
 * @returns {Function} 共享渲染函数；调用时 fn.call({ data, errCall }, ...$args)
 */
export const compileExpr = (expr) => {
  const funcStr = `
const dataRevoked = ${dataRevoked.toString()};
const [$event] = $args;
const {data, errCall} = this;
if(dataRevoked(data)){
  return;
}
try{
  with(data){
    return ${expr};
  }
}catch(error){
  // 宿主元素已脱离文档的报错属于正常回收过程，静默忽略
  if(data.ele && !data.ele.isConnected){
    return;
  }
  if(errCall){
    const result = errCall(error);
    if(result !== false){
      console.error(error);
    }
  }else{
    console.error(error);
  }
}
`;
  return new Function("...$args", funcStr);
};
