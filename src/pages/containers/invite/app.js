export const inviteConfig = [
	{
		path: '/invite',
		redirect: '/invite-list'
	},
	{
		path: '/invite-list',
		name: 'invite-list',
		meta: { title: '我的粉丝' },
		component: () => import('./modules/invite-list.vue')
	},
	{
		path: '/invite-ranking',
		name: 'invite-ranking',
		meta: { title: '' },
		component: () => import('./modules/invite-ranking.vue')
	}
];
