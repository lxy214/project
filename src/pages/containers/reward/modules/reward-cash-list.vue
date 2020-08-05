<template>
	<set-title title="提现明细">
		<xls-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/reward/cash-list/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'xls-reward-cash-list',
	components: {
		"xls-tabs-list": TabsList
	},
	mixins: [navigator('REWARD_CASH_LIST')]
};
</script>

<style lang="scss">
</style>