<template>
	<vcm-modal
		v-model="visible"
		:title="false"
		:footer="false"
		:width="320"
		class="c-press-code"
		@cancel="handleCancel"
		@ok="handleOk"
	>
		<div style="width:290px;height:290px;overflow:hidden;margin:auto">
			<img
				:src="codeUrl+'!2-2'"
				style="width:250px;display:block;margin:auto;padding-bottom:600px;padding:16px 16px 600px 16px"
				class="g-relative g-qr-hack"
				alt="二维码"
				@mousedown="handleTouchStart"
				@mouseup="handleTouchEnd"
				@touchstart="handleTouchStart"
				@touchend="handleTouchEnd"
			>
		</div>
		<div class="g-flex g-center g-m-t-20 g-pd-b-20 g-pd-t-10" style="background:#F4F4F4;border-radius:0 0px 10px 10px">
			<span class="g-c-3 g-m-r-16" style="width:160px">{{ msg }}</span>
			<img
				:src="M_8"
				style="width:60px"
				alt=""
				crossOrigin="anonymous"
				@mousedown="handleTouchStart"
				@mouseup="handleTouchEnd"
				@touchstart="handleTouchStart"
				@touchend="handleTouchEnd"
			>
		</div>
	</vcm-modal>
</template>
<script>
import { Portal } from '@wya/vc';
import { OSS } from '@constants/constants';

// 考虑图片加载的时间问题，如果网络不好可能导致图片丢失，可以在弹出此弹窗之前就开始加载此弹窗图片资源（使用隐藏的img标签），弹窗出来后再次加载图片资源就会从浏览器缓存加载了

const com = {
	name: 'xls-template-modal',
	components: {
	},
	props: {
		codeUrl: String, // 二维码url
		touchCallback: Function, // 达到touchTime后执行的回调
		touchTime: { // 长按持续时间 单位 s(秒)
			type: Number,
			default: 1
		},
		msg: {
			type: String,
			default: '进入公众号',
		}
	},
	data() {
		return {
			M_8: OSS.M_8,
			visible: false,
			src: '',
			hasSend: false
		};
	},
	mounted() {
		this.visible = true;
		// setTimeout(() => {
		// 	this.createImg();
		// }, 200);
	},
	beforeDestroy() {
		clearInterval(this.timer);
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleTouchStart(event) {
			if (this.hasSend) return;
			clearInterval(this.timer);
			this.time = 0;
			this.timer = setInterval(() => {
				this.time += 0.1;
				if (this.time >= this.touchTime) {
					if (this.touchCallback) {
						this.touchCallback(this.time);
						this.hasSend = true;
					}
					clearInterval(this.timer);
					this.timer = undefined;
					this.time = 0;
				}
			}, 100);
		},
		handleTouchEnd() {
			clearInterval(this.timer);
			this.time = 0;
		},
		async createImg() {
			let res = await this.$refs.html2img.getImage({ filename: '推广' });
			this.src = res.base64Image;
		}
		
	}
	
};
export default com;
export const PressCode = new Portal(com, {});
</script>
<style lang="scss">
.c-press-code {
	.vcm-modal__content {
		padding: 30px 0px 0px 0px ;
	}
	.vcm-modal__mask {
		background-color: rgba(0,0,0,.9);

	}
	.vcm-modal__wrapper {
		// top:40%;
		user-select: none;
		position: absolute;
	}
	
}
</style>