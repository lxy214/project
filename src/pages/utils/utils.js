// -- 微一案工具库 --
export * from '@wya/utils';
import { URL, RegEx, Storage, Cookie } from '@wya/utils';
import net from './net';



// -- end --
/**
 * 改写@wya/utils里表单验证的正则
 */
RegEx.set({
	URLScheme: {
		value: /[a-zA-z]+:\/\/[^\s]*/,
		msg: "请填写正确网页地址协议"
	},
	letterAndNumber: {
		value: /^[A-Za-z0-9]{1,}$/,
		msg: "请不要输入特殊字符"
	},
	phone: {
		value: /^0[1-9][0-9]{1,2}-[2-8][0-9]{6,7}$/,
		msg: "请填写正确的电话号码"
	}
});

// -- 业务相关 --

export const initSelect = (res, value, label, children, level = 1) => {
	let __arr = [];
	const __child = [];
	if (res instanceof Array && level > 0) {
		for (let j = 0; j < res.length; j++) {
			__arr = [...__arr, {
				value: res[j][value] || j,
				label: res[j][label] || res[j],
				children: initSelect(res[j][children], value, label, children, level - 1)
			}];
		}
		return __arr;
	}
	return level == 0 ? undefined : [];
};
/**
 *
 */
export const initTreeData = (obj, value, label, children) => {
	if (typeof obj === 'object') {
		return JSON.parse(
			JSON.stringify(obj)
				.replace(new RegExp(value, 'g'), 'value')
				.replace(new RegExp(label, 'g'), 'label')
				.replace(new RegExp(`children|${children}`, 'g'), 'children')
		);
	}
	console.error('参数错误');
	return [];
};

/**
 * 初始化数据
 * @param  {String} res 传入的数据
 * @param  {String} id  数组是已str区分 ，默认'id'
 * @param  {String} _count
 * @param  {Object} initObj 判断是否有init
 * @param  {Array} initArr 判断是否有init
 * @return {String}
 * 参考reducers中的使用
 */
export const initItem = (res, str, count, initObj, initArr) => {
	let itemArr = [];
	let itemObj = {};
	let targetArr;
	const id = str || 'id';
	if (typeof res == "object" && res.data && res.data instanceof Array) { // 传入的不是数组。res.data是数组
		targetArr = res.data;
	} else if (res instanceof Array) { // 传入的是数组
		targetArr = res;
	} else {
		return console.error('初始化参数错误');
	}
	for (let i = 0; i < targetArr.length; i++) {
		itemArr = [...itemArr, targetArr[i][id]];
		itemObj = {
			...itemObj,
			[targetArr[i][id]]: initObj || targetArr[i]
		};
	}
	/* 判断是否有_count*/
	if (count) {
		const { _count } = res;
		return { itemArr, itemObj, _count };
	}
	return { itemArr, itemObj };
};
/**
 * 作为分页初始数据
 * for mobile
 */
export const initScroll = {
	// current: 0,
	total: 0,
	count: 0,
	data: []
};
/**
 * 作为分页初始数据
 * for pc
 */
export const initPage = {
	reset: false,
	current: 0,
	total: 0,
	count: 0,
	data: {}
};


const now = +(new Date());
let index = 0;

export const getUid = (comp) => {
	return `wya-${now}-${++index}`;
};

/**
 * 下一步，下一步设计
 */
// let timestamp = new Date();
export const createSession = (key, opts = {}) => {
	let session = key || getUid();
	if (session !== key) {
		// 先确定url, 避免存在异步后返回的问题
		let { path, query } = URL.parse();
		
		let config = URL.merge({
			path,
			query: {
				...query,
				session
			}
		});

		/**
		 * 使用异步修改url的方式
		 * 在微信iOS端第一次打开页面时，立即重定向导致长按不能扫描二维码，签名首次失败的场景
		 * 必要时候设置为异步函数的时间尽可能在获取完成签名接口的时间+100ms【暂时定500ms+, 这里用800ms】
		 *
		 * 具体看wx-manager下的注释，存在一定联系
		 */
		let fn = () => {
			window.history.replaceState(null, null, config);
		};

		setTimeout(fn, 800);
		
		// 这个设计存在js执行后，还在加载chunk时间影响，所有索性每次800ms后执行，开发时候要注意一下
		// (new Date() - timestamp) > 800
		// 	? fn()
		// 	: setTimeout(fn, 800);
	}
	
	return session;
};

/**
 * 设置formData数据
 * @param {Object} to 
 * @param {Object} from 
 */
export const setData = (to, from) => {
	for (let key in to) {
		if (from[key] !== undefined) {
			to[key] = from[key];
		}
	}
};
/**
 * 遍历树结构，fn一旦返回false就会停止遍历
 * @param {Array} tree 树结构
 * @param {Function} fn 对每个节点执行一遍fn方法 
 * @param {String} childrenKey  作为children的键
 */
export const treeForEach = (tree, fn, childrenKey = 'children') => {
	for (let i = 0; i < tree.length; i++) {
		if (fn(tree[i]) === false) return false;
		if (
			tree[i][childrenKey] 
			&& tree[i][childrenKey].length 
			&& treeForEach(tree[i][childrenKey], fn) === false
		) return false;
	}
};
/**
 * 从树结构里根据value找到第一个结点
 * @param {*} value 
 * @param {Array} tree [{label,value,children}]
 */
export const findNodeByValue = (tree, value) => {
	let result;
	treeForEach(tree, (node) => {
		if (node.value === value) {
			result = node;
			return false;
		}
	});
	return result;
};
/**
 * 从树结构里根据label找到第一个结点
 * @param {*} value 
 * @param {Array} tree [{label,value,children}]
 */
export const findNodeByLabel = (tree, label) => {
	let result;
	treeForEach(tree, (node) => {
		if (node.label === label) {
			result = node;
			return false;
		}
	});
	return result;
};
/**
 * 
 * @param {Array} tree [{label,value,children}]
 * @param {Object} option 
 * { 	
 * labelKey String 将转换为label的键  default:'label'	
 * valueKey String 将转换为value的键  default:'value'	
 * childrenKey String 将转换为children的键 default:'children'	
 * clean Boolean 是否剔除其余属性，default:true		
 * getValue Function 用于获取value的函数，传入当前节点,优先级高于valueKey default:undefind	
 * getLabel Function 用于获取label的函数，传入当前节点,优先级高于labelKey default:undefind	
 * getChildren Function 用于获取label的函数，传入当前节点,优先级高于childrenKey default:undefind					
 * deep Number 转化树结构的深度,为0时转化所有，默认为0 default:0				
 * }
 * @param {Array} result  目标数组，不用传 default:[]
 * 此方法不会修改原数据，会返回一个新的数组		
 * example:	  	
 * initTree(data, { labelKey: 'region_name', valueKey: 'national_code', childrenKey: 'childn_ational' })
 */
export const initTree = (tree, option, result = []) => {
	const { labelKey = 'label', valueKey = 'value', childrenKey = 'children', clean = true, getValue, getLabel, getChildren, deep = 0 } = option;
	for (let i = 0; i < tree.length; i++) {
		result[i] = {
			label: getLabel ? getLabel(tree[i]) : tree[i][labelKey],
			value: getValue ? getValue(tree[i]) : tree[i][valueKey],
		};
		if (!clean) {
			result[i] = { ...tree[i], ...result[i] };
		}
		const _children = getChildren ? getChildren(tree[i]) : tree[i][childrenKey];
		if (deep !== 1 && _children && _children.length) {
			result[i].children = [];
			initTree(
				_children, 
				deep > 1 ? { ...option, deep: option.deep - 1 } : option, 
				result[i].children
			);
		}
	}
	return result;
};

export const formatDate = (date, format = 'YYYY-MM-DD') => {
	return date && moment(date).format(format);

};

// 等待 单位秒
export const sleep = (s = 0) => new Promise(r => setTimeout(r, s * 1000));
