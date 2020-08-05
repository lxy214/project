const api = {
	/**
	 * 请注释模块内容
	 */
	PRODUCT_MAIN_GET: '/drainage/activity/fission.json', // 裂变活动详情
	_PRODUCT_MAIN_SKU_GET: '/drainage/activity/get-sku.json', // 获取活动商品规格
	_PRODUCT_MAIN_HISTORY_ADDRESS_GET: "/orders/orders/get-history-address.json", // 获得历史收获地址
	_PRODUCT_MAIN_CAN_BUY_GET: "/orders/orders/is-can-buy.json", // 判断是否可购买
	_PRODUCT_MAIN_REMAIN_LOTTRY_NUM: "/drainage/wheel/remain-lottery-num.json" // 剩余抽奖次数
};
export default api;
