<template>
	<div class="v-activity-turntable-result g-flex g-fd-c">
		<div class="g-relative g-tc g-col _img" :style="'background-image:url('+ M_45 +')'">
			<div class="g-center __header">
				恭喜获得
			</div>
			<div class="__result">
				<div class="g-fs-15 g-tc" style="color: #C49966;">
					{{ title }}
				</div>
				<div class="g-tc g-m-t-5">
					<span v-if="prizeType != 3" class="g-inline-block __block">
						<span class="__number">{{ costPrice }}</span>
						<span class="g-fs-15" style="color: #C49966;">元</span>
					</span>
					<span v-else class="g-inline-block __imgs">
						<img :src="img || M_12">
					</span>
				</div>
			</div>

			<div style="width: 100%;margin-top: 35%;">
				<div class="g-tc g-m-b-15">
					兑奖截止时间 {{ endTime }}
				</div>
				<!-- <div 
					v-if="[2,3].includes(+prizeType)" 
					class="g-tc g-m-b-15 g-fs-18" 
					style="color: #ED0858;"
				>
					兑奖码：{{ winningCode }}
				</div> -->
				<!-- <vc-clipboard
					v-if="[2,3].includes(+prizeType)"
					:value="winningCode"
					tag="div"
					class="g-tc g-fs-18 _button"
				>
					<div @click="handleGoPrise">
						复制兑奖码并去兑换
					</div>
				</vc-clipboard> -->
				<div class="g-tc g-fs-18 _button" @click="handleGoPrise">
					立即领奖
				</div>
				<div class="g-tc g-m-tb-15">
					{{ tips }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
/**
 *  event： to-prize
 */
import { OSS } from '@constants/constants';
import { PressCode } from '@components/_common/press-code/press-code';

export default {
	name: 'xls-result',
	props: {
		title: String,
		price: String,
		img: String,
		prizeType: [String, Number], // 1 公众号红包  2 现金红包 ,3 实物礼品   4 无奖品
		endTime: String, // 截止时间
		tip: String, // 底部提示
		costPrice: [String, Number],
		winningCode: [String, Number],
		tips: String,
		msg: String
	},
	data() {
		return {
			M_45: OSS.M_45,
			M_12: OSS.M_12,
			codeData: {
				"max_role": 1, // 角色id ，1 小白 ，2 会员 ， 3 分享商 ， 4 代理
				"status": 1, // 1不在白名单黑名单2在白名单3在黑名单
				"drainage_type": 1, // 1公众号2社群3客服微信
				"subscribe": 0, // 1是否关注公众号
				"qr_code": "", // 引流二维码，只有未关注才有值
				"is_group_full": 1, // 1群是否已满，群满的时候显示公众号二维码
				"operation_tips": "", // 操作提示
				"qr_code_tips": "", // 二维码提示
				is_join: 0,
			},
			turntableCodeData: {
				"qr_code_id": 0, // 0 则代表是公众号，不需要加次数
				"qr_code_url": ""
			},
		};
	},
	created() {
		if (+this.$route.query.activity_tool_type === 2) {
			this.loadRewardCode(); // 兑奖码
		} else {
			this.loadAttractCode(); // 引流码
		}
	},
	methods: {
		loadRewardCode() {
			this.$request({
				url: "_REWARD_PRIZE_QR_CODE_INFO_GET",
				type: "GET",
				param: {
					prize_id: this.$route.query.prize_id
				},
				loading: false
			}).then(res => {
				this.turntableCodeData = res.data;
			
			}).catch((res) => {
				console.error(res);
			});
		},
		loadAttractCode() {
			this.$request({
				url: "_ACTIVITY_FISSION_CODE_GET",
				type: "GET",
				param: {
					activity_id: this.$route.query.activity_id, 			},
				loading: false
			}).then(res => {
			
				this.codeData = res.data;
			}).catch((res) => {
				console.error(res);
			});
		},
		handleGoPrise() {
			if (this.$route.query.activity_tool_type == 2) {
				this.handleTurntableView();
			} else {
				this.handleFessionView();
			}
		},
		handleFessionView() { // 裂变活动的情况走引流逻辑

			// 如果是非黑白名单的代理，如果没有关注公众号则弹基础设置的公众号二维码，如果关注了，直接进入奖励列表
			if (this.codeData.max_role == 4 && this.codeData.status == 1) {
				if (this.codeData.subscribe) { // 如果关注了，直接进入订单列表
					this.$router.push({
						path: '/reward-list',
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
				(this.codeData.drainage_type == 1 && this.codeData.subscribe) // 如果是公众号引流并且已关注公众号
				|| ((this.codeData.drainage_type == 2 || this.codeData.drainage_type == 3) && this.codeData.is_join && this.codeData.subscribe) // 如果是个人/社群引流并且已加入is_join=1
			) { 
				this.$router.push({
					path: '/reward-list',
					query: {
						admin_id: this.$global.user.admin_id
					}
				}); 
				return;	
			}
			let codeUrl = this.codeData.qr_code;
			let msg = this.codeData.qr_code_tips;
			if (this.codeData.drainage_type == 2 || this.codeData.drainage_type == 3) {
				if (this.codeData.is_group_full) { // 如果是社群码或个人微信，并且群已满则显示基础设置的公众号
					codeUrl = this.$config.qr_code; // 配置的公众号
					msg = "长按二维码进入公众号";
				}
			}

			if (!codeUrl) return this.$Toast.info('未获取到二维码');
			PressCode.popup({ 
				codeUrl,
				touchCallback: (time) => {
					this.sendFessionJoin();
				},
				msg
			});
		},
		sendFessionJoin() {
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

		handleTurntableView() {
			if (this.turntableCodeData.qr_code_id == 0 && this.turntableCodeData.subscribe) { // 公众号二维码并且已经关注公众号，直接去兑奖列表
				this.$router.push({
					path: '/reward-list',
					query: {
						admin_id: this.$global.user.admin_id
					}
				}); 
				return;
			}
			PressCode.popup({
				codeUrl: this.turntableCodeData.qr_code_url,
				touchCallback: this.sendTurnTableJoin,
				msg: this.msg
			}).catch(e => e && console.error(e));
		},
		sendTurnTableJoin() {
			// 如果是公众号不需要加次数
			if (this.turntableCodeData.qr_code_id == 0) return;
			this.$request({
				url: '_REWARD_PRIZE_QR_ADD_CLICK_POST',
				type: "POST",
				param: {
					activity_id: this.$route.query.activity_id,
					qr_code_id: this.turntableCodeData.qr_code_id
				},
				loading: false,
				successTip: false,
				errorTip: false
			}).then(res => {
			}).catch((res) => {
				console.error(res);
			});
		},

	}
};
</script>

<style lang="scss">
.v-activity-turntable-result {
	._img {
		background-size: 100% auto;
		background-repeat: no-repeat;

		.__header {
			padding-top: 20px;
			font-size: 33px;
			font-family: 'PingFang SC';
			font-weight: 500;
			font-style: italic;
			color: #A1662E;
			position: absolute;
			width: 100%;
		}

		.__img {
			width: 100%;
		}

		.__result {
			width: 100%;
			margin-top: 60%;

			.__block {
				border-bottom: 1px solid #C49966;

				.__number {
					font-size: 35px;
					color: #C49966;
					font-weight: 500;
					margin-top: 10px;
				}
			}

			.__imgs {
				img {
					width: 100px;
					height: 100px;
				}
			}
		}
	}

	._button {
		width: 80%;
		height: 48px;
		line-height: 48px;
		background:linear-gradient(-60deg,#FFC97F,#E39F53);
		border-radius: 5px;
		color: #9D4918;
		margin-left: 10%;
	}
}
</style>