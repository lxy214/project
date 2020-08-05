<template>
	<div>
		<dxb-empty v-if="errorTip" :tips="errorTip.tip" :img="errorTip.img" />
		<dxb-turntable-container
			v-else
			:decorate-data="decorateData"
			:table-opt="tableOpt"
			:before-start="beforeStart"
			@end="handleEnd"
		>
			<div class="g-tc g-fs-16 g-c-9 g-m-t-12 g-c-white g-m-b-20">
				剩余{{ activityInfo.remainLotteryNum }}次抽奖机会
			</div>
		</dxb-turntable-container>
	</div>
</template>

<script>
import { OSS } from '@constants/constants';
import Empty from '@common/empty';
import { Storage } from '@utils/utils';
import { refreshUserInfo } from '@routers/hooks';

import TurnTable from './turntable';
import { Reward } from '../common/reward';
import TurnTableCon from './table-container';
import { UserInfo } from './popup/user-info';
import { NoPrize } from './popup/no-prize';

const { M_20, M_12, M_19, M_24 } = OSS;

const defPrizeImg = {
	1: OSS.M_19,
	2: OSS.M_19,
	3: OSS.M_12,
	4: OSS.M_46,
};

export default {
	name: 'xls-tpl',
	components: {
		'dxb-turntable-container': TurnTableCon,
		'dxb-empty': Empty

	},
	data() {
		return {
			query: { ...this.$route.query },
			tableOpt: {
				endId: 3,
				list: [
					// { name: '红包200', img: OSS.M_19, id: 1 },
				],
				panecolor: ['#ff9fa4', '#ffffff', '#f48e97']
			},
			activityInfo: {
				start_time: "", // 开始时间
				end_time: "", // 结束时间
				activity_name: "", // 活动名称
				remainLotteryNum: 0, // 剩余抽奖次数
				prizeItems: [],
				prizeExchangeList: [
					// 		  {
					//     "user_id": 20,
					//     "prize_name": "奖品1",
					//     "head_img_url": "",
					//     "nick_name": ""
					// },
				],
				decorate_content: {
					decorate_custom: 0,
					decorate_bg: '',
					decorate_show_list: false,
					decorate_explain: '',
				}
			},
			prize_exchange_id: undefined,
			inTurning: false,
			status: undefined

		};
	},
	computed: {
		decorateData() {
			return {
				decorate_custom: 0,
				decorate_bg: '',
				decorate_show_list: false,
				decorate_explain: '',
				...this.activityInfo.decorate_content,
				personList: this.activityInfo.prizeExchangeList.map(
					i => ({ name: i.nick_name, prize_name: i.prize_name, img: i.head_img_url, })
				),
			};
		},
		errorTip() {
			const codeMap = {
				'-1001': {
					tip: '对不起，你当前没有操作权限',
					img: 'M_24' 
				},
				'-1002': {
					tip: '对不起，来晚了，活动已结束啦~',
					img: 'M_39' 
				}
			};
			return codeMap[this.status];
		
		}
	},
	created() {
		this.loadActivity();
	},
	methods: {
		handleEnd() {
			this.inTurning = false;
			const endPrize = this.activityInfo.prizeItems.find(item => item.wheel_prize_id === this.tableOpt.endId);
			if (!endPrize) return console.error('没有找到奖品 id=' + this.tableOpt.endId);

			setTimeout(() => {
				if (endPrize.prize_type == 4) {
					this.$Toast.info('很遗憾没有中奖');
					if (this.activityInfo.remainLotteryNum <= 0 && this.$route.query.activity_tool_type == '1') {
					// 裂变活动 抽奖次数已抽完，进入订单结果页
						setTimeout(() => {
							NoPrize.popup().then(() => {
								this.$router.push({
									path: '/order-result',
									query: {
										...this.$route.query
									}
								});

							});
						}, 1000);
					}
					return;
				}
				Reward.popup({
					title: "中奖啦",
					msg: endPrize.prize_name,
					img: endPrize.image_url || defPrizeImg[endPrize.prize_type],
					redPack: endPrize.prize_type == 1 || endPrize.prize_type == 2
				}).then(() => {
					this.$router.push({
						path: "/activity-turntable-result",
						query: {
							...this.$route.query,
							prize_exchange_id: this.prize_exchange_id,
							prize_id: endPrize.wheel_prize_id
						}
					});
				});
			}, 500);
		},
		async beforeStart() {
			if (!this.activityInfo.is_begin) {
				this.$Toast.info(`活动将于${this.activityInfo.start_time}开始`);
				return Promise.reject();
			}
			if (this.activityInfo.remainLotteryNum <= 0) {
				this.$Toast.info('抽奖次数已用完');
				return Promise.reject();
			}

			try {
				if (
					!this.$global.user.mobile 
					|| (this.$config.open_collect_wx && !this.$global.user.wechat)
				) {
					await UserInfo.popup({ activityId: this.$route.query.activity_id });
					// 重写刷新用户信息，原则上直接使用Global.updateUser()就行; 设计缺陷吧
					await refreshUserInfo();
				}
			} catch (e) {
				return Promise.reject();
			}

			return this.loadEdnPrize();
		},
		loadEdnPrize() {
			if (this.inTurning || this.activityInfo.remainLotteryNum == 0) return;
			this.inTurning = true;
			return this.$request({
				url: "_ACTIVITY_TURNTABLE_ACTIVITY_LOTTERY_GET",
				type: "POST",
				param: {
					activity_id: +this.query.activity_id
				},
				loading: false,
				successTip: false
			}).then(res => {
				this.prize_exchange_id = res.data.prize_exchange_id;
				this.tableOpt.endId = res.data.prize_id;
				this.activityInfo.remainLotteryNum--;
			}).catch((res) => {
				this.inTurning = false;
				return Promise.reject();
			});
		},
		loadActivity() {
			this.$request({
				url: "_ACTIVITY_TURNTABLE_ACTIVITY_INFO_GET",
				type: "GET",
				param: {
					activity_id: +this.query.activity_id
				},
				loading: false,
			}).then(res => {
				res.data.decorate_content = JSON.parse(res.data.decorate_content);
				this.activityInfo = res.data;
			
				this.tableOpt.list = res.data.prizeItems.map(item => ({
					name: item.prize_name.substr(0, 8), 
					price: (item.prize_type == 1 || item.prize_type == 2) ? item.cost_price : "",
					prize_type: item.prize_type,
					id: item.wheel_prize_id,
					img: item.image_url || defPrizeImg[item.prize_type]
				}));

				this.emitWxShare(res.data);
			}).catch((res) => {
				if (res.status !== 0) {
					this.status = res.status;
					return;
				}
			});
		},

		emitWxShare(data) {
			const { admin_id } = this.$global.user;
			const { activity_id, activity_tool_type } = this.$route.query;
			const { activity_name, share_content, share_image_url } = data;

			let base = this.$router.options.base;
			base.pop();

			const link = URL.merge({ 
				path: base.join('/') + this.$route.path,
				query: {
					admin_id,
					activity_id,
					activity_tool_type
				} 
			});
			return {
				title: activity_name,
				desc: share_content || '我中奖啦，邀请你一起来抽奖哦~',
				link,
				imgUrl: share_image_url || OSS.M_12 
			};

		}
	},
};
</script>

<style lang="scss">
</style>
