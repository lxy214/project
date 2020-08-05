/**
 * ajax
 * @param  {[type]} url     地址
 * @param  {[type]} method  请求类型
 * @param  {[type]} body    请求的参数
 * @param  {Object} options 扩展
 */
import createHttpClient from '@wya/http';
import { Storage, Device, getUid } from '@wya/utils';
import { MToast } from '@wya/vc';
import { Map } from '@xls/public';
import { SCROLL_HISTORY_EVENT } from '@xls/public/src/funcs/scroll-manager';
import { clearLoginAuth } from '@routers/hooks';
import { cloneDeep } from 'lodash';
import API_ROOT from '../stores/apis/root';
import { NAV_UPDATE, DEBUG } from '../constants/constants';

let toast = null;

const loadingFn = ({ options }) => {
	const { tipMsg } = options || {};
	toast && MToast.destroy(toast);
	toast = MToast.loading(tipMsg || '加载中...', 0);
};
const loadedFn = () => {
	toast && MToast.destroy(toast);
};

const otherFn = ({ response }) => {
	switch (response.status) {
		// 如果返回-1表示登录失效，清除登录信息，去验证微信授权
		case -1:
			clearLoginAuth();
			break;
		default:
			break;
	}
};

const beforeFn = ({ options }) => {
	return new Promise(async (resolve, reject) => { // eslint-disable-line
		// 没有地址直接为空
		let location = options.location
			? Device.wechat
				? await window.$wx.resetLocation()
				: await Map.Manager.resetLocation()
			: {};

		// options优先级更高
		resolve({
			...options,
			param: {
				...location,
				...options.param,
			},
			headers: {
				token: options.headers.token || _global.user.token,
				inviteUserId: options.headers.invite_user_id || _global.user.invite_user_id,
				activityId: options.headers.activity_id || _global.user.activity_id,
				...options.headers,
			}
		});
	});
};

const afterFn = ({ options, response }) => {

	// 延迟打印，debug会注入延迟
	if (DEBUG && response.code) {
		console.error(options, response);
	}

	let {
		successTip = true,
		errorTip = true,
		errorMsg = response.msg,
		successMsg = response.msg,
		method
	} = options;

	successTip = successTip && method !== 'GET';
	errorTip = errorTip && !response.code;

	if (options.scroll) {
		window.app.$vc.emit(SCROLL_HISTORY_EVENT);
	}
	// 可以是promise，不要随便写return
	switch (response.status) {
		case 0:
			errorTip && errorMsg && MToast.error(errorMsg);
			break;
		case 1:
			successTip && successMsg && MToast.info(successMsg);
			break;
		default:
			break;
	}

};

const globalOptions = {
	onLoading: loadingFn,
	onLoaded: loadedFn,
	onOther: otherFn,
	onBefore: beforeFn,
	onAfter: afterFn,
	apis: API_ROOT,
	debug: process.env.NODE_ENV !== 'production'
};

export default createHttpClient(globalOptions);
