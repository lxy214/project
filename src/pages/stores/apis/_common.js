const api = {
	/**
	 * 公共的api
	 */
	_COMMON_REGION_GET: '/base/public/get-all-address.json', // 获取省市区地址
	_WECHAT_SIGNATURE_URL: '/base/wechat/ticket.json', // 获取微信签名
	_COMMON_SEND_CODE_POST: "/base/sms/send-code.json", // 发送验证码
	_COMMON_WECHAT_PAY_POST: "/orders/pay/on-line.json", // 获取支付签名
	_COMMON_LOCATION_GET: "/base/public/get-location.json?", // lat=30.25924446&lng=120.21937542,根据经纬度获得地区码
	_COMMON_FOOTER_NAV_GET: '/drainage/activity/get-bottom-navigation.json', // 获取底部导航
	_COMMON_SAVE_USER_POST: '/user/user/set-user-info.json', // 设置当前用户信息





};
export default api;
export const xlsApi = {
	_XLS_AUTH_URL_GET: "/base/auth/get-url-dxb.json",
	_XLS_AUTH_INFO_GET: "/base/auth/get-info-dxb.json"
};
