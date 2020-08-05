<template>
	<div class="v-poster-main g-relative">
		<div
			style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
			class="g-absolute"
		>
			<img
				v-if="showImg"
				:src="showImg"
				style="width: 500px; border-radius: 12px;"
				alt=""
				class="v-poster-main-qrcode__img"
			>
			<vc-html-img
				v-else
				ref="target"
				:parser="()=>false"
				style="width: 300px; margin: 0 auto;"
			>
				<div class="_wrap">
					<div class="_bg-wrap g-relative g-bg-white">
						<img
							:src="poster_setting.background_img || OSS['BG_07']"
							class="_bg"
							:style="{
								width: widthHeightRadio > (300 / 332) ? '' : '100%',
								height: widthHeightRadio > (300 / 332) ? '100%' : '',
							}"
							crossOrigin="anonymous"
						>
					</div>
					<div class="_info g-flex g-jc-sb g-ai-c g-pd-l-20 g-pd-tb-15 g-bg-white g-pd-r-5">
						<div class="g-flex-cc">
							<img
								v-if="poster_setting.invite_msg_show_type.includes(2)"
								:src="poster_setting.head_img_url"
								class="g-m-r-8"
								style="width: 40px; height: 40px; border-radius: 50%;"
								crossOrigin="anonymous"
							>
							<span
								v-if="poster_setting.invite_msg_show_type.includes(1)"
								:style="{
									color: '$c3',
									'max-width': '100px'
								}"
								class="g-fs-14"
							>
								{{ poster_setting.nick_name | substrText }}
							</span>
						</div>
						<div class="g-flex g-fd-c g-ai-c">
							<img
								:src="qrcodeSrc"
								style="width: 56px;height: 56px;"
							>
							<span class="g-m-t-10 g-c-000 g-fs-12">
								长按识别二维码进入
							</span>
						</div>
					</div>
				</div>
			</vc-html-img>
			<div class="g-tc g-c-999 g-m-t-20 g-fs-18">
				长按图片保存
			</div>
			<span @click="handlePressCode">
				测试弹出
			</span>
			<vcm-input v-model="value" />
		</div>
	</div>
</template>

<script>
import { createQRCode } from '@wya/qrcode';
import { MToast } from '@wya/vc';
import { OSS } from '@constants/constants';
import { PressCode } from '@components/_common/press-code/press-code';


export default {
	name: 'xls-tpl',
	filters: {
		substrText(v) {
			return v.length > 13 ? v.substr(0, 13) + '...' : v;
		}
	},
	components: {
	},
	data() {
		console.log('data ----------');
		return {
			OSS,
			poster_setting: {
				background_img: '',
				head_img_url: '',
				mobile_domain: '',
				nick_name: '',
				invite_msg_show_type: [1, 2],
			},
			widthHeightRadio: '',
			showImg: '',
			status: '',
			value: ''
		};
	},
	computed: {
		qrcodeSrc() {
			let { mobile_domain, invite_user_id } = this.poster_setting;
			return createQRCode(window.location.origin + mobile_domain, { typeNumber: 7 });
			// return createQRCode(`${mobile_domain}&invite_user_id=${invite_user_id}`, { typeNumber: 7 });
		},
	},
	created() {
		console.log('created ----------');

	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			setTimeout(() => {
				const res = { data: { data: { 
					background_img: '',
					head_img_url: '123',
					mobile_domain: '123',
					nick_name: '123',
					invite_msg_show_type: [1, 2],
				 } } };
				this.poster_setting = res.data.data;
				let image = new Image();
				image.src = this.poster_setting.background_img || OSS['BG_07'];

				image.onload = () => {
					console.log('load');
					this.widthHeightRadio = image.naturalWidth / image.naturalHeight;
					this.handleSaveImg();
				};
				
			}, 1000);
			
			
		},
		handleSaveImg() {
			let loading = MToast.loading('海报生成中...',);
			this.$nextTick(async () => {
				let res = await this.$refs.target.getImage();
				loading.handleRemove();
				this.showImg = res.base64Image;
			});
		},
		handlePressCode() {
			let url1 = 'https://wyatest.oss-cn-hangzhou.aliyuncs.com/image/172/20200507/1758405060/t1.jpg';
			let url2 = 'https://wyatest.oss-cn-hangzhou.aliyuncs.com/image/172/20200422/1433453363/9ADFD26B33DB7F9A2C3269410EB1219F.jpg';
			PressCode.popup({
				codeUrl: url1,
				touchCallback: undefined,
				msg: '长按二维码进入公众号'
			}).catch(e => e && console.error(e));
		}
	},
};
</script>
<style lang="scss">
.v-poster-main {
	._wrap {
		width: 300px;
		._bg-wrap {
			width: 100%;
			height: 332px;
			border-top-left-radius: 12px;
			border-top-right-radius: 12px;
			overflow: hidden;
			._bg {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
		._info {
			width: 100%;
			height: 120px;
			border-bottom-left-radius: 12px;
			border-bottom-right-radius: 12px;
		}
	}
	.v-poster-main-qrcode__img { // ipone识别兼容
		padding:200px 0 0 200px !important;
		margin:-200px 0 0 -200px !important;
		position: relative;
		z-index: 100;
		-webkit-user-select: none;
	}
}
</style>
