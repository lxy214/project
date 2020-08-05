<template>
	<set-title ref="title" :share="false" title="幸运大转盘">
		<xls-content />
	</set-title>
</template>

<script>

import content from '@components/activity/turntable/content';

export default {
	name: 'xls-activity-turntable',
	components: {
		'xls-content': content
	},
	data() {
		return {
		};
	},
	created() {
	}
};
</script>

<style lang="scss">
</style>
