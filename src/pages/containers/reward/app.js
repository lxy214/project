export const rewardConfig = [
	{
		path: '/reward',
		redirect: '/reward-list'
	},
	{
		path: '/reward-list',
		name: 'reward-list',
		meta: { title: '奖品与奖励' },
		component: () => import('./modules/reward-list.vue')
	},
	{
		path: '/reward-result',
		name: 'reward-result',
		meta: { title: '兑奖结果' },
		component: () => import('./modules/reward-result.vue')
	},
	{
		path: '/reward-detail',
		name: 'reward-detail',
		meta: { title: '奖励详情' },
		component: () => import('./modules/reward-detail.vue')
	},
	{
		path: '/reward-cash',
		name: 'reward-cash',
		meta: { title: '奖励提现' },
		component: () => import('./modules/reward-cash.vue')
	},
	{
		path: '/reward-cash-account',
		name: 'reward-cash-account',
		meta: { title: '奖品与奖励' },
		component: () => import('./modules/reward-cash-account.vue')
	},
	{
		path: '/reward-cash-list',
		name: 'reward-cash-list',
		meta: { title: '提现明细' },
		component: () => import('./modules/reward-cash-list.vue')
	}
];