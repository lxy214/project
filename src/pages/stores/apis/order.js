const api = {
	/**
	 * 请注释模块内容
	 */
	ORDER_MAIN_GET: '/orders/orders/get-confirm-info.json', // 	确认订单页信息
	_ORDER_MAIN_SUBMIT_POST: "/orders/orders/submit-orders.json", // 提交订单
	_ORDER_RESULT_INFO_GET: "/orders/pay/orders-info.json", // 订单详情获取
	ORDER_RESULT_GET: '',
	ORDER_LIST_GET: '/orders/orders/get-orders-list.json', // 订单列表
	_ORDER_LIST_CONFIRM_DELIVERY_POST: '/orders/orders/receipt.json', // 确认收货
	_ORDER_DETAIL_GET: '/orders/orders/get-orders-detail.json', // 订单详情
	_ORDER_DETAIL_DELIVERY_GET: '/base/public/query-logistics-details.json', // 获取物流信息
	_ORDER_GET_NEW_PAY_ORDER_GET: "/orders/orders/get-new-pay-orders.json", // 获得最近的订单
	_ORDER_CANCEL_POST: "/orders/pay/orders-cancel.json", // 取消订单
	ORDER_TRANSPORT_GET: ''
};
export default api;
