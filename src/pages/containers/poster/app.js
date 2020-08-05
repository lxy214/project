export const posterConfig = [
	{
		path: '/poster',
		redirect: '/poster-main'
	},
	{
		path: '/poster-main',
		name: 'poster-main',
		meta: { title: '' },
		component: () => import('./modules/poster-main.vue')
	}
];
