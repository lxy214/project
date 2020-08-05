<template>
	<vcm-modal
		v-model="visible"
		title="title"
		:footer="false"
		class="v-activity-turntable-no-prize"
		:mask-closable="false"
	>
		<div slot="header" class="g-flex">
			<div class="g-pd-l-14 g-col g-tc g-fs-16 g-weight-5 g-c-0">
				抽奖次数用完啦
			</div>
		</div>
		<img :src="M_46">
		<div class="g-pd-l-14 g-col g-tc g-fs-16 g-weight-5 g-c-0">
			很遗憾，未中奖呢～
		</div>
		<div class="_green-btn g-m-16" @click="handleOk">
			返回订单页
		</div>
	</vcm-modal>
</template>
<script>
import { Portal } from '@wya/vc';
import { OSS } from '@constants/constants';

const com = {
	name: 'xls-template-modal',
	components: {
	},
	props: {

	},
	data() {
		return {
			M_46: OSS.M_46,
			visible: false,
			formData: {
				name: ''
			},
			rules: {
				name: [
					{ required: true, type: 'string', message: "请输入", trigger: "blur" }
				]
			},
		};
	},
	mounted() {
		this.visible = true;
		
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
	}
};
export default com;
export const NoPrize = new Portal(com, {});
</script>
<style lang="scss">
.v-activity-turntable-no-prize {
	.vcm-modal__header {
		padding-top: 14px;
		padding-bottom: 14px;
	}
	.vcm-modal__content {
		padding: 0;
		._green-btn {
			height:48px;
			background:rgb(92,186,124);
			border-radius:5px;
			color: white;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

}
</style>