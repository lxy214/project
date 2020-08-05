<template>
	<set-title title="我的粉丝">
		<xls-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/invite/list/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'xls-invite-list',
	components: {
		"xls-tabs-list": TabsList
	},
	mixins: [navigator('INVITE_LIST')]
};
</script>

<style lang="scss">
</style>