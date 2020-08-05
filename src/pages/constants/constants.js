import {
	// DEBUG_DOMAIN,
	// OFFICIAL_DOMAIN,
	SYSTEM_VERSION as PUBLIC_SYSTEM_VERSION,
	DEBUG as PUBLIC_DEBUG,
	REGION_KEY as PUBLIC_REGION_KEY,
	REGION_CONFIG_KEY as PUBLIC_REGION_CONFIG_KEY,
	API_DOMAIN
} from '@xls/public/src/configs/constants';

export { API_DOMAIN };
export const SYSTEM_VERSION = PUBLIC_SYSTEM_VERSION;
/**
 *
 * 在配置的域名下开启debug功能,路由参数DEBUG输入DEBUG_SECRET的值可也开启debug
 */
const DEBUG_ORIGIN = [
	'https://dxb-mobile.wyawds.com',
	'https://12107635.wyawds.com',
	'https://12107635.topxls.com',
	'https://dxb-test.ruishan666.com'
];
const DEBUG_SECRET = '679459';
export const DEBUG = window.location.origin.startsWith('http://192.168')
					|| DEBUG_ORIGIN.includes(window.location.origin)
					|| window.location.search.includes('DEBUG=' + DEBUG_SECRET);

/**
 * 开发模式结合PHP后端
 * true开启，false关闭
 * 即!0后端。!1前端:3000端口
 */
export const DEV_WITH_SERVER = !0;

/**
 * 根路由
 */
export const PRE_ROUTER_URL = process.env.NODE_ENV === 'development'
	? '/'
	: '/dxb/';

export const URL_WEBSOCKET = '/wss';

/**
 * 用于判断登录token / user
 */
export const USER_KEY = 'user';
export const LOCAL_DATA_KEY = 'local_data';
/**
 * 用于设置初始数据
 */
export const CONFIG_KEY = 'setting';

/**
 * 全局配送地址key
 */
export const ADDRESS_KEY = 'globalAddress';

/**
 * 步进器key
 */
export const STEPPER_KEY = '@xls/stepper';

/**
 * 导航刷新事件
 */
export const NAV_UPDATE = 'NAV_UPDATE';

/**
 * 地址库和地址库配置的KEY
 */
export const REGION_KEY = PUBLIC_REGION_KEY;
export const REGION_CONFIG_KEY = PUBLIC_REGION_CONFIG_KEY;

export const XLS_MOBILE_BASE_URL = PUBLIC_DEBUG
	? 'https://gateway-mobile.wyawds.com'
	: 'https://gateway-mobile.weiyianmd.com';

/**
 * OSS 阿里云图片地址
 */
const OSS_BASE_URL = 'https://oss.weiyianmd.com/common/dxb/';
const _OSS = {
	ICON_O1: 'icon-01.png',
	ICON_O2: 'icon-02.png',
	ICON_O3: 'icon-03.png',
	ICON_O4: 'icon-04.png',
	ICON_O5: 'icon-05.png',
	ICON_O6: 'icon-06.png',
	ICON_O7: 'icon-07.png',
	ICON_O8: 'icon-08.png',
	ICON_O9: 'icon-09.png',
	ICON_10: 'icon-10.png',
	ICON_11: 'icon-11.jpg',

	BG_01: 'bg-01.png',
	BG_02: 'bg-02.png',
	BG_03: 'bg-03.png',
	BG_04: 'bg-04.png',
	BG_05: 'bg-05.png',
	BG_06: 'bg-06.png',
	BG_07: 'bg-07.png',
	BG_08: 'bg-08.png',

};
// 自动创建M_XX:m-xx.png格式的键值对
for (let i = 1; i <= 100; i++) {
	_OSS['M_' + i] = 'm-' + i + '.png';
}

export const OSS = {};
Object.keys(_OSS).forEach(key => {
	OSS[key] = OSS_BASE_URL + _OSS[key];
});
Object.freeze(OSS); // 冻结对象，可以直接引入组件而不会影响性能

export const letterMap = {};
for (let i = 65; i < 91; i++) {
	letterMap[i] = String.fromCharCode(i);
}
Object.freeze(letterMap);
