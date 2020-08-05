<template>
	<div class="c-common-empty">
		<img v-if="img" :src="OSS[img]" alt="图片加载失败" class="g-dp-ib _img"> <br>
		<span v-if="tips" class="g-m-t-10 g-dp-ib">{{ tips }}</span>
		<slot />
	</div>
</template>
<script>
import { OSS } from '@constants/constants';

export default {
	name: 'xls-',
	components: {
	},
	props: {
		img: {
			type: String,
			default: 'M_24'
		},
		tips: {
			type: String
		},
	},
	data() {
		return {
			OSS
		};
	},
	methods: {
	}
};
</script>
<style lang="scss">
.c-common-empty {
	text-align: center;
	margin-top: 64px;
	._img {
		width: 200px;
	}

}
</style>