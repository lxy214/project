const api = {
	/**
	 * 请注释模块内容
	 */
	ACTIVITY_TURNTABLE_GET: '',
	ACTIVITY_TURNTABLE_RESULT_GET: '',
	_ACTIVITY_FISSION_GET: "/drainage/activity/fission.json", // 裂变活动获取
	_ACTIVITY_TURNTABLE_ACTIVITY_INFO_GET: "/drainage/wheel/activity-info.json", // 大转盘活动详情
	_ACTIVITY_TURNTABLE_ACTIVITY_LOTTERY_GET: "/drainage/wheel/wheel-lottery.json", // 大转盘抽奖
	_ACTIVITY_TURNTABLE_EXCHANGE_INFO_GET: "/drainage/wheel/prize-exchange-info.json", // 兑奖记录
	_ACTIVITY_FISSION_CODE_GET: "/drainage/activity/get-fission-qr-code.json", // 引流二维码
	_ACTIVITY_FISSION_JOIN_GROUP_POST: "/drainage/activity/join-group.json", // 新增加入群人数
	ACTIVITY_TEST_GET: '',
	_ACTIVITY_FISSION_LATEST_EXCHANAGE_GET: "/drainage/wheel/get-last-prize-exchange-id.json"
};
export default api;
