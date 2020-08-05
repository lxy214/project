<template>
	<div v-show="showPage" class="v-order-result">
		<dxb-activity v-if="orderInfo.wheel_template_id && orderInfo.real_draw_num" :order-info="orderInfo" />
		<dxb-normal v-else :order-info="orderInfo" />
	</div>
</template>

<script>
import { OSS } from '@constants/constants';
import Normal from './scence/normal';
import Activity from './scence/activity';


export default {
	name: 'xls-tpl',
	components: {
		'dxb-normal': Normal,
		'dxb-activity': Activity
	},
	data() {
		return {
			img: OSS.ICON_O1,
			orderInfo: {
				product_info: []
			},
			codeData: {

			},
			showPage: false
		};
	},
	created() {
		this.loadOrderInfo();

	},
	methods: {
		loadOrderInfo() {
			this.$request({
				url: "_ORDER_RESULT_INFO_GET",
				type: "GET",
				param: {
					orders_id: this.$route.query.orders_id
				},
				loading: false,
			}).then(res => {
				this.orderInfo = res.data;
				if (this.$route.query.activity_tool_type == '1') {
					this.checkLottery();
				} else {
					this.showPage = true;
				}
			}).catch((res) => {
				console.error(res);
			});
		},
		loadAttractCode() {
			return this.$request({
				url: "_ACTIVITY_FISSION_CODE_GET",
				type: "GET",
				param: {
					activity_id: this.$route.query.activity_id, 			},
				loading: false
			}).then(res => {
			
				return res.data;
			}).catch((res) => {
				console.error(res);
			});
		

		},
		loadLatestLottery() {
			return this.$request({
				url: "_ACTIVITY_FISSION_LATEST_EXCHANAGE_GET",
				type: "GET",
				param: {
					activity_id: this.$route.query.activity_id
				},
				loading: false,
			}).then(res => {
				return res.data.prize_exchange_id;
			}).catch((res) => {
				console.error(res);
			});

		},
		async checkLottery() {
			// 如果抽奖机会用完了，并且没关注公众号或 （已经关注公众号了但是没有长按一秒），并且之前已经抽中了，就跳到去领奖页面，针对当前活动id
			if (this.orderInfo.real_draw_num) return this.showPage = true; // 还有有抽奖次数
			const prize_exchange_id = await this.loadLatestLottery(); // 有抽中则有值
			if (!prize_exchange_id) return this.showPage = true;
			this.codeData = await this.loadAttractCode();
			if (!this.codeData) return this.showPage = true;

			if (this.codeData.drainage_type == 1) { // 如果是公众号
				if (this.codeData.subscribe) return this.showPage = true; // 如果已经关注
				this.$router.push({
					path: "/activity-turntable-result",
					query: {
						...this.$route.query,
						prize_exchange_id,
						activity_tool_type: '1'
					}
				});
			} else if (this.codeData.drainage_type == 2 || this.codeData.drainage_type == 3) { // 否则如果是社群/个人 
				if (this.codeData.is_join && this.codeData.subscribe) return this.showPage = true; // 如果已经长按过二维码
				if (this.codeData.max_role == 4 && this.codeData.status == 1 && this.codeData.subscribe) { // 如果是非黑白名单的代理，并且已经关注公众号
					return this.showPage = true;
				}
				this.$router.push({
					path: "/activity-turntable-result",
					query: {
						...this.$route.query,
						prize_exchange_id,
						activity_tool_type: '1'
					}
				});
				return this.showPage = true;
			}
			this.showPage = true;
			
		}

	},
};
</script>

<style lang="scss">
.v-order-result {
	._green-btn {
		width:290px;
		height:48px;
		background:rgb(92,186,124);
		border-radius:5px;
	}
	._gray-btn {
		width:290px;
		height:48px;
		background:white;
		border: 1px solid #333;
		border-radius:5px;
	}

}
</style>
