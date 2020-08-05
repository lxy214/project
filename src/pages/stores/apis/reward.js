const api = {
	/**
	 * 请注释模块内容
	 */
	REWARD_LIST_GET: '',
	REWARD_REWARD_LIST_GET: '/reward/reward/reward-list.json', // 分享奖励
	_REWARD_REWARD_DETAIL_GET: '/reward/reward/reward-detail.json', // 奖励详情
	REWARD_PRIZE_LIST_GET: '/reward/prize/prize-list.json', // 抽奖奖励
	_REWARD_PRIZE_DETAIL_GET: '/reward/prize/prize-detail.json', // 抽奖奖品详情
	_REWARD_PRIZE_STATISTICS_GET: '/reward/reward/reward-statistics.json', // 用户奖励账户
	_REWARD_PRIZE_EXCHANGE_POST: '/reward/prize/prize-exchange.json', // 兑奖操作
	_REWARD_PRIZE_QR_CODE_INFO_GET: '/drainage/wheel/qr-code-info.json', // 兑奖二维码
	_REWARD_PRIZE_QR_ADD_CLICK_POST: '/drainage/wheel/add-click.json', // 兑奖二维码点击
	REWARD_RESULT_GET: '',
	REWARD_DETAIL_GET: '',
	REWARD_CASH_GET: '',
	REWARD_CASH_ACCOUNT_GET: '',
	_REWARD_CASH_ACCOUNT_FEE_GET: '/finance/withdraw/amount-fee.json', // 获取可提现金额/手续费/手续费比例
	_REWARD_CASH_ACCOUNT_SUPPORT_BANK_GET: '/finance/withdraw/support-account.json', // 获取系统支持提现账户
	_REWARD_CASH_ACCOUNT_WITHDRAW_ACCOUNT_GET: '/finance/withdraw/withdraw-account.json', // 获取用户提现账户
	_REWARD_CASH_ACCOUNT_SAVE_ACCOUNT_POST: '/finance/withdraw/save-account.json', // 新增/编辑提现账户
	_REWARD_CASH_ACCOUNT_DELETE_ACCOUNT_POST: '/finance/withdraw/delete-account.json', // 删除提现账户
	_REWARD_CASH_ACCOUNT_WITHDRAW_POST: '/finance/withdraw/withdraw.json', // 提现操作
	_REWARD_CASH_LIST_GET: '/finance/withdraw/list.json' // 提现明细
};
export default api;
