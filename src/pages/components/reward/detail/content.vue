<template>
	<div class="v-reward-detail g-flex g-fd-c">
		<div class="g-flex g-flex-ac g-jc-sb g-pd-lr-12 _header">
			<template v-if="+type === 1">
				<div class="g-c-white g-fs-18">
					{{ ['待兑奖','已兑奖','已失效'][detail.status - 1] }}
				</div>
				<img :src="[M_11,M_10,M_9][detail.status - 1]" class="__img">
			</template>
			<template v-else>
				<div class="g-c-white g-fs-18">
					{{ ['待结算','已结算','已失效'][+detail.reward_grant_status] }}
				</div>
				<img :src="[M_3,M_2,M_9][+detail.reward_grant_status]" class="__img">
			</template>
		</div>

		<xls-luck 
			v-if="+type === 1" 
			class="g-col"
			:data-source="detail" 
		/>
		<xls-share 
			v-else
			class="g-col"
			:data-source="detail"
		/>
	</div>
</template>

<script>
import { OSS } from '@constants/constants';
import Luck from './luck';
import Share from './share';

export default {
	name: 'xls-content',
	components: {
		'xls-luck': Luck,
		'xls-share': Share
	},
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || ''),
			M_11: OSS.M_11, // 待兑奖
			M_10: OSS.M_10, // 已兑奖
			M_9: OSS.M_9, // 已失效
			M_3: OSS.M_3, // 待结算
			M_2: OSS.M_2, // 已结算
			detail: {}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			let API = +this.type === 1 ? '_REWARD_PRIZE_DETAIL_GET' : '_REWARD_REWARD_DETAIL_GET';

			this.$request({
				url: API,
				type: "GET",
				param: {
					prize_exchange_id: +this.type === 1 ? this.$route.query.prize_exchange_id : '',
					orders_reward_id: +this.type === 2 ? this.$route.query.orders_reward_id : ''
				},
				loading: false
			}).then(res => {
				this.detail = res.data;
			}).catch((res) => {
				console.error(res);
			});
		}
	}
};
</script>

<style lang="scss">
.v-reward-detail {
	._header {
		width: 100%;
		height: 112px;
		background:linear-gradient(133deg,#312649,#625277);

		.__img {
			width: 85px;
			height: 65px;
		}
	}
}
</style>