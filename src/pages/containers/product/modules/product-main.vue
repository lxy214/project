<template>
	<set-title ref="title" title="活动商品">
		<xls-content />
	</set-title>
</template>

<script>

import content from '@components/product/main/content';

export default {
	name: 'xls-product-main',
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
