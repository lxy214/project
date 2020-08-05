export const productConfig = [
	{
		path: '/product',
		redirect: '/product-main'
	},
	{
		path: '/product-main',
		name: 'product-main',
		meta: { title: '商品详情' },
		component: () => import('./modules/product-main.vue')
	}
];
