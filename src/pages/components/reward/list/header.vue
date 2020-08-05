<template>
	<div class="v-reward-list-header g-flex g-flex-ac g-jc-sb g-pd-l-12 g-pd-r-8">
		<div class="g-flex g-flex-ac">
			<div class="g-pd-r-15 _total">
				<div class="g-c-white g-fs-15">
					￥{{ detail.reward_amount }}
				</div>
				<div class="g-c-fd g-fs-12">
					累计奖励
				</div>
			</div>
			<div class="g-pd-l-12" @click="handleGoCash">
				<div class="g-c-white g-fs-15">
					￥{{ detail.wait_withdraw_amount }}
				</div>
				<div class="g-c-fd g-fs-12">
					待提现奖励
				</div>
			</div>
			<vcm-icon type="right" class="g-c-white g-fs-14 g-m-l-12" @click="handleGoCash" />
		</div>
		<div class="g-c-white g-flex g-flex-ac" @click="handleGoCashDetail">
			<span class="g-fs-14">提现明细</span>
			<vcm-icon type="right" class="g-fs-14 g-m-l-8" />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			detail: {}
		};
	},
	created() {
		this.loadData();
		this.$vc.on('REWARD_LIST_HEADER_UPDATE', this.loadData);
	},
	beforeDestroy() {
		this.$vc.off('REWARD_LIST_HEADER_UPDATE', this.loadData);
	},

	methods: {
		loadData() {
			this.$request({
				url: "_REWARD_PRIZE_STATISTICS_GET",
				type: "GET",
				loading: false
			}).then(res => {
				this.detail = res.data;
			}).catch((res) => {
				console.error(res);
			});
		},
		handleGoCash() {
			this.$router.push({
				path: '/reward-cash'
			});
		},
		handleGoCashDetail() {
			this.$router.push({
				path: '/reward-cash-list'
			});
		}
	}
};
</script>

<style lang="scss">
.v-reward-list-header {
    width: 100%;
    height: 75px;
    background:linear-gradient(-28deg,#625277,#312649);

    ._total {
        border-right: 1px solid #FDFDFD;
    }
}
</style>
