<template>
	<set-title title="下单成功">
		<xls-content />
	</set-title>
</template>

<script>

import content from '@components/order/result/content';

export default {
	name: 'xls-order-result',
	components: {
		'xls-content': content
	},
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
