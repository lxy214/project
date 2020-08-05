<template>
	<vcm-modal
		v-model="visible"
		:title="false"
		:footer="false"
		class="v-reward-list-modal-reward"
		@cancel="handleCancel"
		@ok="handleOk"
	>
		<div class="g-tc">
			<img :src="M_13" class="_img">
		</div>
		<div style="margin-top: 30px;">
			{{ prizeType === 1 ? '红包已发送到公众号，请24小时内领取' : '红包已入账到提现余额' }}
		</div>

		<div class="g-flex g-flex-cc g-m-t-30">
			<div class="g-pointer _button" @click="handleOk">
				知道了
			</div>
		</div>
	</vcm-modal>
</template>
<script>
import { Portal } from '@wya/vc';
import { OSS } from '@constants/constants';

const com = {
	name: 'v-reward-list-modal-reward',
	components: {
	},
	props: {
		prizeType: {
			type: Number
		}
	},
	data() {
		return {
			M_13: OSS.M_13,
			visible: false
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export default com;
export const Reward = new Portal(com, {});
</script>

<style lang="scss">
.v-reward-list-modal-reward {
	._img {
		width: 75px;
		height: 75px;
	}

	._button {
		width: 172px;
		height: 48px;
		line-height: 48px;
		text-align: center;
		color: #ffffff;
		background: #5CBA7C;
		border-radius: 5px;
	}
}
</style>