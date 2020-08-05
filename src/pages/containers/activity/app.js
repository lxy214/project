export const activityConfig = [
	{
		path: '/activity-turntable',
		name: 'activity-turntable',
		meta: { title: '' },
		component: () => import('./modules/activity-turntable.vue')
	},
	{
		path: '/activity-turntable-result',
		name: 'activity-turntable-result',
		meta: { title: '' },
		component: () => import('./modules/activity-turntable-result.vue')
	}
];
