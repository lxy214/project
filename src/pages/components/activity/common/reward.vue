<template>
	<vcm-modal
		v-model="visible"
		:title="false"
		:footer="false"
		:mask-closable="false"
		class="v-activity-c-reward"
		@cancel="handleCancel"
	>
		<div class="g-center g-fd-c">
			<div class="g-fs-18 _red g-m-t-20">
				中奖啦!
			</div>
			<div class="g-center">
				<template v-if="redPack">
					<img :src="M_51" alt="" class="g-dp-ib" style="height:180px;">
				</template>
				<template v-else>
					<div class="g-absolute _orange-bg g-dp-ib" />
					<div
						class="g-absolute g-dp-ib" 
						style="width:138px;height:138px;background-size:cover;background-position:center"
						:style="'background-image:url('+img+')'"
					>
						<!-- <img class="g-absolute g-dp-ib" :src="img"> -->
					</div>
					<img :src="M_15" class="g-dp-ib" style="width:230px;height:230px;opacity:0.9">
				</template>
			</div>
			<div class="g-fs-16 _red g-m-t-24">
				{{ msg }}
			</div>
			<div class="_green-btn g-center g-fs-18 g-c-white g-m-t-24 g-m-b-12" @click="handleOk">
				查看详情
			</div>
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
		img: {
			type: String,
			default: OSS.M_12

		},
		title: {
			default: '中奖啦!',
			type: String,
		},
		msg: {
			type: String,
			default: '奖品'
		},
		redPack: Boolean

	},
	data() {
		return { 
			M_16: OSS.M_16,
			M_15: OSS.M_15,
			M_51: OSS.M_51,
			visible: false,
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
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export default com;
export const Reward = new Portal(com, {});
</script>
<style lang="scss">
.v-activity-c-reward {
	._red {
		color:#ED0858
	}
	._green-btn {
		width:220px;
		height:48px;
		background:rgb(92,186,124);
		border-radius:5px;
	}
	._orange-bg {
		width:148px;height:148px;
		background:linear-gradient(1deg,rgba(224,100,60,1),rgba(235,130,62,1));
	}
	.vcm-modal__no-title {
		padding-top: 0px;
		padding-bottom: 0px;
	}
}
</style>