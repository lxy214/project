<template>
	<!-- 有绑定额外活动的情况 -->
	<div class="v-order-result-normal g-center g-fd-c">
		<img :src="img" alt="" style="width:120px;" class="g-m-t-60">
		<div class="g-c-0 g-fs-18 g-m-t-40">
			恭喜下单成功！获得抽奖机会{{ orderInfo.draw_num }}次
		</div>
		<div class="_green-btn g-fs-18 g-c-white g-center g-m-t-40" @click="handleToLucky">
			去抽奖
		</div>
	</div>
</template>
<script>
import { OSS } from '@constants/constants';

export default {
	name: 'xls-',
	components: {
	},
	props: {
		orderInfo: Object

	},
	data() {
		return {			
			img: OSS.M_12,

		};
	},
	methods: {
		handleToLucky() {
			this.$router.push({
				path: "/activity-turntable",
				query: {
					...this.$route.query
				}
			});
			
		}
	}
};
</script>
<style lang="scss">
</style>