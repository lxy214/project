<template>
	<div class="v-reward-cash">
		<div class="g-bg-white g-pd-lr-12 g-c-0 g-fs-16 _header">
			预计3个工作日内到账
		</div>

		<div class="g-bg-white g-pd-lr-12 g-pd-t-10 g-pd-b-16 g-m-t-10">
			<div class="g-fs-16 g-c-0">
				提现金额
			</div>
			<div class="g-bb g-m-t-30 g-flex g-flex-ac">
				<span class="g-fs-24 g-c-0">￥</span>
				<vcm-input-number
					v-model="withdrawAmount"
					:step="false"
					placeholder="请输入提现金额"
					:precision="2"
					:min="0"
					:max="+fee.total_amount || 0"
				/>
				<span 
					class="g-fs-14 g-inline-block g-tr g-pointer" 
					style="color: #5FC48D;width: 100px;"
					@click="withdrawAmount = (fee.total_amount || 0)"
				>
					全部提现
				</span>
			</div>
			<div class="g-m-t-16 g-fs-14 g-c-9 g-flex g-jc-sb ">
				<span>可提现金额 ￥{{ fee.total_amount || 0 }}</span>
				
				<span v-if="+feeAmount > 0">（需手续费：￥{{ feeAmount }}）</span>
				<!-- <span v-else>无需手续费</span> -->
			</div>
		</div>

		<div class="g-bg-white g-pd-l-12 g-pd-t-15 g-m-t-10">
			<div class="g-fs-16 g-c-0 g-m-b-15">
				提现到
			</div>
			<div>
				<div 
					v-for="(item,index) in bankInfo"
					:key="index"
					class="g-pd-tb-10 g-bb g-pd-r-12 g-flex g-jc-sb"
					@click="handleOperation(item,index)"
				>
					<div class="g-flex g-flex-ac">
						<vcm-icon 
							:type="item.icon_type" 
							:style="{color: item.icon_color}"
							class="g-fs-24"
						/>
						<span class="g-fs-16 g-c-0 g-m-l-5">{{ item.bank || item.account_name }}</span>
						<span v-if="item.account" class="g-fs-16 g-c-0 g-m-l-5">
							{{ item.account.substr(0,4)+'****'+ item.account.substr(item.account.length-4,4) }}
						</span>
					</div>
					<div class="g-flex g-flex-ac">
						<vcm-icon v-if="currentIndex === index" type="m-select" class="g-fs-16 g-c-9 g-c-blue-mid g-relative" />
						<template v-if="item.account_type != 1">
							<span class="g-m-lr-5">|</span>
							<span 
								class="g-operation g-inline-block g-tc"
								style="width: 40px;"
								@click.stop="handleGoAccount(item)"
							>
								修改
							</span>
						</template>
					</div>
				</div>
				<div class="g-pd-tb-12 g-pd-r-12 g-flex g-jc-sb" @click="handleGoAccount()">
					<span class="g-fs-16 g-c-3">+新增提现账户</span>
					<vcm-icon type="right" class="g-fs-16 g-c-9" />
				</div>
			</div>
		</div>
		<!-- <div v-for="(val,key,index) in iconMap" :key="index">
			<vcm-icon :type="val.icon_type" :style="{color:val.icon_color}" class="g-fs-16" />
		</div>
		<vcm-icon :type="defIcon.icon_type" :style="{color:defIcon.icon_color}" class="g-fs-16" /> -->

		<div class="g-center g-m-tb-30">
			<div class="g-tc g-c-white _footer g-fs-16" @click="handleSave">
				提现
			</div>
		</div>
	</div>
</template>

<script>
import { MToast } from '@wya/vc';
import { Calc } from '@utils/utils';

export default {
	name: 'xls-content',
	data() {
		return {
			// 1微信零钱包 2支付宝 3中国银行 4工商银行 5农业银行 6招商银行 7建设银行 8邮政储蓄银行
			iconMap: {
				1: {
					icon_type: "m-weixin",
					icon_color: "#71BD55"
				},
				2: {
					icon_type: "alipay",
					icon_color: "#25ABEE"
				},
				3: {
					icon_type: "m-bank-zhongguo",
					icon_color: "rgb(146,44,53)"
				},
				4: {
					icon_type: "m-bank-gongshang",
					icon_color: "rgb(211,44,38)"
				},

				5: {
					icon_type: "m-bank-nongye",
					icon_color: "rgb(58,132,104)"
				},
				6: {
					icon_type: "m-bank-zhaoshang",
					icon_color: "rgb(210,44,37)"
				},
				7: {
					icon_type: "m-bank-jianshe",
					icon_color: "rgb(16,59,139)"
				},
				8: {
					icon_type: "m-bank-youzheng",
					icon_color: "rgb(47,110,75)"
				}
			},
			defIcon: { icon_type: 'm-bank-card', icon_color: "rgb(211,44,38)" },
			bankInfo: [],
			fee: {},
			withdrawAmount: '',
			currentIndex: '',
			currentItem: {},

		};
	},
	computed: {
		feeAmount() {
			// return (this.withdrawAmount || 0) * (this.fee.fee_rate || 12) / 100;
		
			if (this.fee.fee_type == 0) {
				return 0;
			} else if (this.fee.fee_type == 1) {
				return Calc(this.withdrawAmount || 0)
					.mul(this.fee.fee_rate || 0)
					.div(100).val()
					.toFixed(2);
			} else if (this.fee.fee_type == 2) {
				return this.fee.fee_amount;
			} else return 0;

		}

	},
	async created() {
		this.loadFeeData();
		this.loadBank();
	},
	methods: {
		loadFeeData() {
			this.$request({
				url: "_REWARD_CASH_ACCOUNT_FEE_GET",
				type: "GET",
				loading: false,
				errorTip: false
			}).then(res => {
				this.fee = res.data;
			}).catch((res) => {
				MToast.info(res.msg, 1);
			});
		},
		loadBank() {
			Promise.all([
				this.loadSupportData(),
				this.loadWithDrawData()
			]).then(res => {
				const [bank, banks = []] = res;
				this.bankInfo = [bank, ...banks].filter(Boolean);
				console.log(this.bankInfo);
				this.bankInfo[0] && this.handleOperation(this.bankInfo[0], 0);
			});
		},
		loadSupportData() {
			return this.$request({
				url: "_REWARD_CASH_ACCOUNT_SUPPORT_BANK_GET",
				type: "GET",
				loading: false,
				errorTip: false
			}).then(res => {
				console.log(res);
				const bank = res.data.find(item => item.account_type == 1);
				if (bank) {
					const icon = this.iconMap[bank.type_id] || {};
					console.log('icon-----------', icon);
					return { ...bank, ...icon };
				}
			}).catch((res) => {
				MToast.info(res.msg, 1);
			});
		},
		loadWithDrawData() {
			return this.$request({
				url: "_REWARD_CASH_ACCOUNT_WITHDRAW_ACCOUNT_GET",
				type: "GET",
				loading: false,
				errorTip: false
			}).then(res => {
				return res.data.filter(item => item.account_type != 1).map(item => {
					const icon = this.iconMap[item.type_id] || this.defIcon;
					return {
						...item,
						...icon,
					};
				});
				
			}).catch((res) => {
				res && MToast.info(res.msg, 1);
			});
		},
		handleGoAccount(account) {
			this.$router.push({
				path: '/reward-cash-account',
				query: {
					account: account ? JSON.stringify(account) : undefined
				}
			});
		},
		handleOperation(item, index) {
			this.currentItem = item;
			this.currentIndex = index;
		},
		handleSave() {
			if (this.withdrawAmount <= 0) {
				MToast.info('提现金额必须大于0');
				return;
			}
			if (this.withdrawAmount > this.fee.total_amount) {
				MToast.info('提现金额不能大于可提现金额');
				return;
			}
			if (!this.currentItem.account_type) {
				MToast.info('请先选择提现方式');
				return;
			}
			this.$request({
				url: "_REWARD_CASH_ACCOUNT_WITHDRAW_POST",
				type: "POST",
				param: {
					withdraw_amount: this.withdrawAmount,
					account_id: this.currentItem.account_id ? this.currentItem.account_id : 0,
					account_type: this.currentItem.account_type
				},
				loading: false
			}).then(res => {
				MToast.info(res.msg, 1, () => {
					this.$router.push({
						path: '/reward-list'
					});
				});
			}).catch((res) => {
				MToast.info(res.msg, 1);
			});
		}
	}
};
</script>

<style lang="scss">
.v-reward-cash {
	._header {
		width: 100%;
		height: 44px;
		line-height: 44px;
	}

	._footer {
		width:80%;
		height:48px;
		line-height: 48px;
		background: #5CBA7C;
		border-radius:5px;
	}
}
</style>
