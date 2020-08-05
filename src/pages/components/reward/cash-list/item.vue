<template>
	<div class="v-reward-cash-list-item">
		<div class="g-flex g-jc-sb g-flex-ac g-pd-lr-12 g-pd-tb-16">
			<div class="g-bg-white g-pd-lr-12 _left">
				<span class="g-fs-14 g-c-6 g-m-r-10">{{ it.month }}</span>
			</div>
			<div class="g-fs-14 g-c-6">
				提现 ￥{{ it.total_amount }}
			</div>
		</div>

		<div 
			v-for="(item,index) in it.list"
			:key="index"
			class="g-bg-white"
		>
			<div class="g-pd-10 g-bb g-flex g-jc-sb">
				<div class="g-flex g-flex-ac">
					<div 
						:style="{background: bg[item.account_type - 1]}"
						class="_icon"
					>
						<vcm-icon :type="icon[item.account_type - 1]" class="g-c-white g-fs-24" />
					</div>
					<div class="g-m-l-15">
						<div class="g-fs-14 g-c-0">
							提现到{{ ['微信钱包','线下-支付宝','线下-银行卡'][item.account_type - 1] }}
						</div>
						<div style="color: #9C9FA6;">
							{{ item.create_time }}
						</div>
						<div style="color: #9C9FA6;">
							提现编号：{{ item.withdraw_sn }}
						</div>
					</div>
				</div>

				<div :style="{color: item.status_name === '提现中' ? '#FF3F4D' : ''}">
					<div 
						:class="item.status_name === '提现中' ? '' : 'g-c-0'" 
						class="g-fs-14"
					>
						{{ item.received_amount }}
					</div>
					<div :class="item.status_name === '提现中' ? '' : 'g-c-3'">
						{{ item.status_name }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "xls-item",
	props: {
		it: Object
	},
	data() {
		return {
			icon: ['m-weixin', 'alipay', 'bank-card'],
			bg: ['#71BD55', '#25ABEE', '#E50112']
		};
	},
	methods: {
		handleInit() {
			this.$store.commit('REWARD_CASH_LIST_INIT');
		}
	}
};
</script>

<style lang="scss">
.v-reward-cash-list-item {
	._left {
		padding-top: 7px;
		padding-bottom: 7px;
		border-radius: 13px;
	}

	._icon {
		width: 40px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		border-radius:50%;
	}
}
</style>