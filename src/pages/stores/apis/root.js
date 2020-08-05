import { RegEx } from '@utils/utils';
import { API_DOMAIN, DEBUG, DOMAIN } from '@xls/public/src/configs/constants';
import { DEV_WITH_SERVER, XLS_MOBILE_BASE_URL } from '../../constants/constants';
import _common, { xlsApi } from './_common';
import login from './login';
import home from './home';
import reward from './reward';
import product from './product';
import poster from './poster';
import order from './order';
import invite from './invite';
import activity from './activity';

const API = {
	..._common,
	...login,
	...home,
	...reward,
	...product,
	...poster,
	...order,
	...invite,
	...activity,
};

let baseUrl;

/* global __DEV__ */
if (__DEV__) {
	// 开发环境
	if (!DEV_WITH_SERVER) { // 开发环境-前端自模拟
		baseUrl = 'http://localhost:3000';
	} else { // 开发环境-后端数据
		baseUrl = `https://dxb-mobile.${API_DOMAIN}`;
	}
} else {
	// 生产环境
	if (/^ruishan666\.com|^topxls\.com/.test(DOMAIN)) {
		baseUrl = 'https://dxb-mobile.wyawds.com';
	} else {
		baseUrl = DEBUG
			? `https://dxb-mobile.${API_DOMAIN}`
			: `https://dxb-m.${API_DOMAIN}`;
	}

	// debug重写时存在延迟
	setTimeout(() => console.log({ baseUrl, DEBUG, DOMAIN, API_DOMAIN }), 0);
}
for (let i in API) {
	if (RegEx.URLScheme.test(API[i])) {
		// API[i] = API[i];
	} else {
		API[i] = baseUrl + API[i];
	}
}

const xlsAPI = {};
for (let i in xlsApi) {
	xlsAPI[i] = XLS_MOBILE_BASE_URL + xlsApi[i];
}

export { xlsAPI };
export default API;
