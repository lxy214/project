<template>
	<div class="v-poster-main g-relative">
		<div
			v-if="status === 1"
			style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
			class="g-absolute"
		>
			<div v-if="showImg" style="border-radius: 12px; overflow: hidden;">
				<img

					:src="showImg"
					style="width: 500px;"
					alt=""
					class="v-poster-main-qrcode__img g-qr-hack"
				>
			</div>
			<vc-html-img
				v-else
				ref="target"
				:parser="() => false"
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
								:src="poster_setting.head_img_url || OSS['ICON_10']"
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
								class="g-m-t-5"
								style="width: 80px;height: 80px;"
							>
							<span class="g-m-t-5 g-c-000 g-fs-12">
								长按识别二维码进入
							</span>
						</div>
					</div>
				</div>
			</vc-html-img>
			<div class="g-tc g-c-999 g-m-t-20 g-fs-18">
				长按图片保存
			</div>
		</div>
		<div v-if="status === 0" class="g-flex-cc g-fd-c" style="height: 100%;">
			<vc-img :src="OSS['M_24']" style="width: 200px;" />
			<span class="g-fs-14 g-c-333 g-m-t-20">对不起，你当前没有操作权限</span>
		</div>
	</div>
</template>

<script>
import { createQRCode } from '@wya/qrcode';
import { MToast } from '@wya/vc';
import { OSS } from '@constants/constants';
import { blockingProcess } from "@utils/utils";

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
			status: ''
		};
	},
	computed: {
		qrcodeSrc() {
			let { mobile_domain, invite_user_id } = this.poster_setting;
			return createQRCode(mobile_domain, { typeNumber: 7 });
			// return createQRCode(`${mobile_domain}&invite_user_id=${invite_user_id}`, { typeNumber: 7 });
		},
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_POSTER_MAIN_GET',
				type: 'GET',
				param: {
					activity_id: this.$route.query.activity_id
				}
			}).then(res => {
				this.status = res.data.status;
				if (res.data.status === 1) {
					this.poster_setting = res.data.data;
					let image = new Image();
					image.src = this.poster_setting.background_img || OSS['BG_07'];

					image.onload = () => {
						this.widthHeightRadio = image.naturalWidth / image.naturalHeight;
						this.handleSaveImg();
					};
				}
			}).catch(e => {
				console.error(e);
			});
		},
		handleSaveImg() {
			let toast = MToast.loading('海报生成中...',);
			this.$nextTick(async () => {
				try {
					let res = await this.$refs.target.getImage();
					this.showImg = res.base64Image;
				} catch (e) {
					console.error(e);
				} finally {
					MToast.destroy(toast);
				}
			});
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
			overflow: hidden;
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
