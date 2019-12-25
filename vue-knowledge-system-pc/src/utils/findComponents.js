/**
 * 由一个组件，向上找到最近的指定组件
 * @param  {Object} context       上下文
 * @param  {String} componentName 需要找的指定组件的name
 * @return {Object}               返回找到组件的实例
 */
function findComponentUpward(context, componentName) {
    let parent = context.$parent;
    let name = context.$parent.$options.name;
    // 循环往上遍历
    while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
            name = parent.$options.name;
        }
    }
    return parent;
}
/**
 * 由一个组件，向上找到所有的指定组件，递归使用组件比较少用，一般不用该方法
 * @param  {Object} context       上下文
 * @param  {String} componentName 需要找的指定组件的name
 * @return {Array}                返回找到组件的实例集合
 */
function findComponentsUpward(context, componentName) {
    let parents = [];
    let parent = context.$parent;
    if (parent) {
        if (parent.$options.name === componentName) {
            parents.push(parent)
        }
        // 递归遍历
        return [
            ...parents,
            ...findComponentsUpward(parent, componentName)
        ];
    } else {
        return [];
    }
}
/**
 * 由一个组件，向下找到最近的指定组件，递归遍历子组件
 * @param  {Object} context       上下文
 * @param  {String} componentName 需要找的指定组件的name
 * @return {Object}               返回找到组件的实例
 */
function findComponentDownward(context, componentName) {
    let children = context.$children;
    let child = null;
    if (children.length > 0) {
        for (let item of children) {
            if (item.$options.name === componentName) {
                child = item;
                break;
            } else {
                // 跟Emitter不同，这个函数主要要返回，在第一次递归的时候必须赋值拿到后来递归的返回值
                child = findComponentDownward(item, componentName);
                if (child) break;
            }
        }
    }
    return child;
}
/**
 * 由一个组件，向下找到所有指定的组件，递归遍历子组件，这个比网上遍历所有父组件有用
 * @param  {Object} context       上下文
 * @param  {String} componentName 需要找的指定组件的name
 * @return {Array}                返回找到组件的实例集合
 */
function findComponentsDownward(context, componentName) {
    let ret = [];
    let children = context.$children;
    if (children.length > 0) {
        for (let item of children) {
            if (item.$options.name === componentName) {
                ret.push(item);
            }
            // 递归遍历
            ret = [
                ...ret,
                ...findComponentsDownward(item, componentName)
            ]
        }
        return ret;
    } else {
        return [];
    }
}
/**
 * 由一个组件，找到指定组件的兄弟组件
 * @param  {Object}  context        上下文
 * @param  {String}  componentName  需要找的指定组件的name
 * @param  {Boolean} exceptMe       是否除去组件本身
 * @return {Array}                  返回找到组件的实例集合
 */
function findBrothersComponents(context, componentName, exceptMe = true) {
    let parent = context.$parent;
    let children = parent.$children;
    let brothers = children.filter((child) => {
        return child.$options.name === componentName;
    });
    // 利用vue实例里的_uid属性的值是唯一的做筛选
    let index = brothers.findIndex((brother) => brother._uid === context._uid);
    if (exceptMe) {
        brothers.splice(index, 1);
    }
    return brothers;
}
export {
    findComponentUpward,
    findComponentsUpward,
    findComponentDownward,
    findComponentsDownward,
    findBrothersComponents
};