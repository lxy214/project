<template>
	<!-- 没有绑定其他活动 -->
	<div class="v-order-result-normal">
		<div class="g-flex g-center g-fd-c g-m-tb-20 ">
			<div>
				<img :src="orderInfo.head_img_url" style="width:40px;height:40px;border-radius:50%" class="g-dp-ib" alt="img">
				<span class="g-c-0  g-fs-14 g-m-l-8">{{ orderInfo.nick_name }}</span>
			</div>
			<div class="g-c-0 g-fs-18 g-m-t-12">
				恭喜，下单成功！
			</div>
		</div>
		<div class="g-row-group">
			<div class="g-row-item g-flex g-jc-sb" style="border-color:rgb(232,232,232)">
				<span>
					<span style="background:#8F96E7" class="g-pd-6 g-c-white g-br-4 ">
						{{ orderInfo.activity_tool_name }}
						
					</span>
					<span class="g-fs-14 g-c-3 g-m-l-6">
						{{ orderInfo.activity_name }}
					</span>
				</span>
				<span class="g-fs-14" style="color:#FF3C4A">
					{{ orderInfo.orders_status_name }}
				</span>
			</div>
			<div
				v-for="(product,index2) in orderInfo.product_info ||[]" 
				:key="index2"
				class="g-row-item"
				style="padding:0;border-color:rgb(232,232,232)"
			>
				<div class="g-bg-f8 g-pd-12 g-flex">
					<img :src="product.image_url+'!2-2'" style="max-width:78px;max-height:78px;" class="g-m-r-8">
					<div class="g-col">
						<div class="g-c-0 g-fs-15 g-twoline">
							{{ product.product_name }}
						</div>
						<div v-for="(item,index) in product.sku_value" :key="index" style="background:white" class="g-dp-ib g-m-tb-8">
							<span class="g-pd-6 g-c-9 g-br-4">{{ item.spec_value_name }}</span>
						</div>
						<div class="g-flex g-jc-sb g-fs-14">
							<div class="g-col ">
								<span class=" _red g-m-r-8">¥{{ product.activity_price }}</span>
								<!-- <span class="g-c-9 g-td-lt">¥100.00</span> -->
							</div>
							<div>
								x {{ product.quantity }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="g-row-item g-tr g-c-0 g-fs-14" style="border-color:rgb(232,232,232)">
				合计：¥ {{ orderInfo.pay_amount }}（含运费）
			</div>
		</div>
		<div class="g-center g-fd-c g-m-t-24">
			<div class="_green-btn g-center g-fs-18 g-c-white" @click="handleView">
				查看订单与物流
			</div>
			<!-- <div class="_gray-btn g-center g-fs-18 g-c-3 g-m-t-8" @click="handleToActivity">
				返回活动
			</div> -->
			<!-- <img
				:src="codeData.qr_code"
				style="width:200px;display:block;margin:auto;"
				class="g-relative"
				alt="二维码"
			> -->
			<div class="g-fs-13 g-c-9 g-m-t-12">
				{{ codeData.operation_tips }}
			</div>
		</div>
	</div>
</template>

<script>
import { USER_KEY, OSS } from '@constants/constants';
import { Storage } from '@utils/utils';
import { PressCode } from '../../../_common/press-code/press-code';

export default {
	name: 'xls-tpl',
	components: {
	},
	props: {
		orderInfo: Object

	},
	data() {
		return {
			codeData: {
				// qr_code: '',
				// subscribe: 0,
				// operation_tips: "",
				// qr_code_tips: "",
				"max_role": 2, // 角色id
				"status": 1, // 1不在白名单黑名单2在白名单3在黑名单
				"drainage_type": 1, // 1公众号2社群3客服微信
				"subscribe": 0, // 1已经关注，没有关联大转盘，直接跳转到订单页面（假如关联了大转盘，则跳转到兑奖页面）   0表示没有关注需要引流，则显示引流二维码
				"qr_code": "", // 引流二维码，只有未关注才有值
				"is_group_full": 1, // 1群是否已满，群满的时候显示公众号二维码
				"operation_tips": "", // 操作提示
				"qr_code_tips": "", // 二维码提示
				is_join: 0
			},
		};
	},
	computed: {
		// product() {
		// 	return (this.orderInfo.product_info && this.orderInfo.product_info[0]) || {};
		// }
	},
	created() {
		this.loadCode();
	},
	methods: {
		loadCode() {
			this.$request({
				url: "_ACTIVITY_FISSION_CODE_GET",
				type: "GET",
				param: {
					activity_id: this.$route.query.activity_id
				},
				loading: false,
			}).then(res => {
				this.codeData = res.data;
			
			}).catch((res) => {
				console.error(res);
			});
			
		},
		handleView() {
			// 只能一堆if else

			// 如果是非黑白名单的代理，如果没有关注公众号则弹基础设置的公众号二维码，如果关注了，直接进入订单列表
			if (this.codeData.max_role == 4 && this.codeData.status == 1) {
				if (this.codeData.subscribe) { // 如果关注了，直接进入订单列表
					this.$router.push({
						path: '/order-list',
						query: {
							admin_id: this.$global.user.admin_id
						}
					}); 
					return;
				} else { // 如果没有关注公众号则弹基础设置的公众号二维码
					const codeUrl = this.$config.qr_code;
					if (!codeUrl) return this.$Toast.info('未获取到二维码');
					PressCode.popup({ 
						codeUrl,
						touchCallback: (time) => {
							this.sendTouched();
						},
						msg: '长按二维码进入公众号'
					});
					return;

				}
			}
			if (
				(this.codeData.drainage_type == 1 && this.codeData.subscribe) // 公众号引流并且已经加公众号
				|| ((this.codeData.drainage_type == 2 || this.codeData.drainage_type == 3) && this.codeData.is_join && this.codeData.subscribe)
			) { // 或非公众号引流 并且已经is_join==1 
				this.$router.push({
					path: '/order-list',
					query: {
						admin_id: this.$global.user.admin_id
					}
				});
				return;
			} 
			
			let codeUrl = this.codeData.qr_code;
			let msg = this.codeData.qr_code_tips;
			if (this.codeData.drainage_type == 2 || this.codeData.drainage_type == 3) {
				if (this.codeData.is_group_full) {
					codeUrl = this.$config.qr_code; // 配置的公众号
					msg = "长按二维码进入公众号";
				}
			}

			if (!codeUrl) return this.$Toast.info('未获取到二维码');
			PressCode.popup({ 
				codeUrl,
				touchCallback: (time) => {
					this.sendTouched();
				},
				msg
			 });
		},
		sendTouched() {
			this.$request({
				url: "_ACTIVITY_FISSION_JOIN_GROUP_POST",
				type: "GET",
				param: {
					activity_id: this.$route.query.activity_id
				},
				loading: false,
				successTip: false,
				errorTip: false
			}).then(res => {
			
			}).catch((res) => {
				console.error(res);
			});
			
		},
		handleToActivity() {
			this.$router.push({
				path: '/product-main',
				query: {
					activity_id: this.$route.query.activity_id,
					invite_user_id: this.$route.query.invite_user_id,
					admin_id: this.$route.query.admin_id,
				}
			});
		}
	},
};
</script>

<style lang="scss">
.v-order-result-normal {
		user-select: none;
	

}
</style>
