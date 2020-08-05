<template>
	<set-title title="奖品与奖励">
		<xls-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/reward/list/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'xls-reward-list',
	components: {
		"xls-tabs-list": TabsList
	},
	mixins: [navigator('REWARD_LIST')]
};
</script>

<style lang="scss">
</style>