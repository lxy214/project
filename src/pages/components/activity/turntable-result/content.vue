<template>
	<div class="v-activity-turntable-result g-flex g-fd-c">
		<dxb-result
			class="g-col"
			:title="info.prize_name"
			:prize-type="info.prize_type"
			:end-time="info.expire_time"
			:cost-price="info.cost_price"
			:winning-code="info.winning_code"
			:tips="info.exchange_tip"
			:msg="info.qr_code_tip"
			:img="info.image_url"
		/>
	</div>
</template>

<script>
import { OSS } from '@constants/constants';
import Result from './scence/result';

export default {
	name: 'xls-tpl',
	components: {
		'dxb-result': Result
	},
	props: {

	},
	data() {
		return {

			img: OSS.ICON_O1,
			info: {
				"winning_code": "", // 兑奖码
				"prize_name": "", // 奖品名称
				"prize_id": 0, // 奖品ID
				"activity_id": 0, // 活动ID
				"expire_time": "" 
			}

		};
	},
	created() {
		this.loadResult();
	},
	methods: {
		loadResult() {
			this.$request({
				url: "_ACTIVITY_TURNTABLE_EXCHANGE_INFO_GET",
				type: "GET",
				param: {
					prize_exchange_id: this.$route.query.prize_exchange_id
				},
				loading: false
			}).then(res => {
				this.info = res.data;
			}).catch((res) => {
				console.error(res);
			});
		},
		handleAfter() {
			this.$Toast.success('复制成功');
		}
	}
};
</script>

<style lang="scss">
.v-activity-turntable-result {
	._green-btn {
		width:240px;
		height:48px;
		background:rgb(92,186,124);
		border-radius:5px;
	}
}
</style>