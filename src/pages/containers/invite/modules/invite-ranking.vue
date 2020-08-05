<template>
	<set-title title="">
		<dxb-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/invite/ranking/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'dxb-invite-ranking',
	components: {
		"dxb-tabs-list": TabsList,
	},
	mixins: [navigator('INVITE_RANKING')],
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
