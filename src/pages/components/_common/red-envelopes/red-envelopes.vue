<template>
	<div class="c-common-red-envelopes g-flex g-fd-c">
		<div class="g-relative g-tc g-col _bg" :style="'background-image:url('+ M_45 +')'">
			<div class="g-absolute __header">
				恭喜获得
			</div>

			<div class="g-center __content">
				<div v-if="+detail.prize_type === 1">
					<div class="g-fs-15 g-tc" style="color: #C49966;">
						公众号红包：
					</div>

					<span class="g-inline-block __block">
						<span class="__number">￥{{ detail.cost_price }}</span>
						<span class="g-fs-15" style="color: #C49966;">元</span>
					</span>
				</div>
				<div v-else-if="+detail.prize_type === 2">
					<div class="g-fs-15 g-tc" style="color: #C49966;">
						现金红包：
					</div>
					<span class="g-inline-block __block">
						<span class="__number">￥{{ detail.cost_price }}</span>
						<span class="g-fs-15" style="color: #C49966;">元</span>
					</span>
				</div>
				<div v-else class="g-fs-15 g-tc" style="color: #C49966;">
					{{ detail.prize_name }}
					<div class="g-tc">
						<span class="g-inline-block __imgs">
							<img :src="detail.image_url+'!2-2'">
						</span>
					</div>
				</div>
			</div>

			<div style="margin-top: 40%;">
				<div class="g-tc g-m-b-15">
					兑奖截止时间 {{ detail.create_time }} ～ {{ detail.expire_time }}
				</div>
				<div 
					v-if="+exchangeType === 2" 
					class="g-m-t-8 g-c-0 g-fs-18"
					style="color: #ED0858;"
				>
					兑奖码：{{ detail.winning_code }}
				</div>
				<vc-clipboard
					v-if="+exchangeType === 2"
					:value="detail.winning_code"
					tag="div"
					class="g-tc g-fs-18 g-m-t-5 _button"
					@after="handleGoPrise"
				>
					复制兑奖码并去兑奖
				</vc-clipboard>
				<div 
					v-else 
					class="g-tc g-fs-18 g-m-t-5 _button"
					@click="handleGoPrise"
				>
					立即领奖
				</div>
				<div class="g-tc g-m-tb-15">
					{{ detail.exchange_tip }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { OSS } from '@constants/constants';
import { PressCode } from '../press-code/press-code';

export default {
	name: 'xls-red-envelopes',
	data() {
		const { query } = this.$route;
		
		return {
			img: OSS.ICON_O1,
			M_45: OSS.M_45,
			detail: {},
			prizeExchangeId: String(query.prize_exchange_id || ''),
			exchangeType: String(query.exchange_type || '')
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: "_REWARD_PRIZE_DETAIL_GET",
				type: "GET",
				param: {
					prize_exchange_id: this.prizeExchangeId
				},
				loading: false
			}).then(res => {
				this.detail = res.data;
			}).catch((res) => {
				console.error(res);
			});
		},
		handleAfter() {
			this.$Toast.success('复制成功');
		},
		handleGoPrise() {
			this.$request({
				url: "_REWARD_PRIZE_QR_CODE_INFO_GET",
				type: "GET",
				param: {
					prize_id: this.detail.prize_id
				},
				loading: false
			}).then(res => {
				PressCode.popup({
					codeUrl: res.data.qr_code_url,
					msg: this.detail.qr_code_tip,
					touchCallback: () => {
						if (!res.data.qr_code_id) {
							return;
						} else {
							this.$request({
								url: "_REWARD_PRIZE_QR_ADD_CLICK_POST",
								type: "POST",
								param: {
									qr_code_id: res.data.qr_code_id
								},
								loading: false,
								successTip: false,
								errorTip: false
							}).then(ress => {
							}).catch((ress) => {
								console.error(ress);
							});
						}
					}
				}).then();
			}).catch((res) => {
				console.error(res);
			});
		}
	},
};
</script>

<style lang="scss">
.c-common-red-envelopes {
	._bg {
		background-size: 100% auto;
		background-repeat: no-repeat;

		.__header {
			padding-top: 20px;
			font-size: 33px;
			font-family: 'PingFang SC';
			font-weight: 500;
			font-style: italic;
			color: #A1662E;
			width: 100%;
			text-align: center;
		}

		.__content {
			margin-top: 64%;

			.__block {
				border-bottom: 1px solid #C49966;

				.__number {
					font-size: 35px;
					color: #C49966;
					font-weight: 500;
				}
			}

			.__imgs {
				img {
					max-width: 100px;
					max-height: 100px;
				}
			}
		}
	}

	._button {
		width: 80%;
		height: 48px;
		line-height: 48px;
		background:linear-gradient(-60deg,#FFC97F,#E39F53);
		border-radius: 5px;
		color: #9D4918;
		margin-left: 10%;
	}
}
</style>