<template>
	<set-title title="订单列表">
		<xls-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/order/list/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'xls-order-list',
	components: {
		"xls-tabs-list": TabsList,
	},
	mixins: [navigator('ORDER_LIST')],
	data() {
		return {
		};
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss">
</style>
