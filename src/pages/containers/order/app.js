export const orderConfig = [
	{
		path: '/order',
		redirect: '/order-main'
	},
	{
		path: '/order-main',
		name: 'order-main',
		meta: { title: '' },
		component: () => import('./modules/order-main.vue')
	},
	{
		path: '/order-main-pay',
		name: 'order-main-pay',
		meta: { title: '' },
		component: () => import('./modules/order-main.vue')
	},
	{
		path: '/order-result',
		name: 'order-result',
		meta: { title: '' },
		component: () => import('./modules/order-result.vue')
	},
	{
		path: '/order-list',
		name: 'order-list',
		meta: { title: '' },
		component: () => import('./modules/order-list.vue')
	},
	{
		path: '/order-detail',
		name: 'order-detail',
		meta: { title: '' },
		component: () => import('./modules/order-detail.vue')
	},
	{
		path: '/order-transport',
		name: 'order-transport',
		meta: { title: '' },
		component: () => import('./modules/order-transport.vue')
	}
];
