<template>
	<router-view class="v-router" />
</template>

<script>
export default {
	components: {
	},
	data() {
		return {
			
		};
	},
	mounted() {
		// 移动端软键盘兼容
		
	},
	beforeDestroy() {
		
	},
	methods: {
	

	},
	beforeRouteEnter(to, from, next) {
		next();
	},
	beforeRouteUpdate(to, from, next) {
		this.$vc.clear();
		next();
	},
	beforeRouteLeave(to, from, next) {
		next();
	}
};
</script>

<style lang="scss">

</style>
