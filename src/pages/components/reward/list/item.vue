<template>
	<div class="v-reward-list-item g-m-b-10 g-bg-white g-pd-lr-12 g-pd-t-12" @click="handleGoDetail">
		<div class="g-flex g-jc-sb g-fs-14 g-m-b-15">
			<div class="g-c-3 g-col g-oneline g-m-r-10">
				{{ it.activity_name }}
			</div>
			<div class="g-c-6">
				{{ +type === 1 ? it.create_time: it.orders_create_time }}
			</div>
		</div>

		<div class="g-bg-f8 g-pd-12 g-flex-ac">
			<img
				v-if="+type === 1"
				:src="(it.image_url ? it.image_url : M_19) + '!2-2'"
				class="_product"
			>
			<img
				v-else
				:src="it.orders_image_url + '!2-2'"
				class="_product"
			>
			<div v-if="+type === 1" class="g-m-l-15">
				<div class="g-flex g-flex-ac">
					<span class="g-c-000 g-fs-15 g-m-r-5">
						{{ it.prize_name }}
					</span>
					<span
						:style="{background: bg[it.prize_type - 1]}"
						class="g-inline-block g-c-white _label"
					>
						{{ it.prize_type_name }}
					</span>
				</div>
				<div class="g-m-t-10 g-c-3 g-fs-14">
					{{ it.status == 2 ? it.audit_time : it.expire_time }} {{ +it.status === 2 ? '兑奖成功' : '前兑奖' }}
				</div>
			</div>
			<div v-else class="g-m-l-15">
				<div class="g-fs-15 g-c-0">
					<span class="g-inline-block" style="width: 80px;">订单号：</span>
					<span>{{ it.orders_sn }}</span>
				</div>
				<div class="g-fs-15 g-c-0">
					<span class="g-inline-block" style="width: 80px;">订单金额：</span>
					<span>￥{{ it.orders_amount }}</span>
				</div>
				<div class="g-flex">
					<span class="g-fs-15 g-c-0 g-inline-block" style="width: 80px;">下单人：</span>
					<div class="g-flex g-flex-ac">
						<img
							:src="it.orders_user_head_img"
							class="_nick"
						>
						<span class="g-fs-15 g-c-3 g-m-l-8">{{ it.orders_user_nick_name }}</span>
					</div>
				</div>
			</div>
		</div>

		<div class="g-flex g-flex-ac _footer">
			<template v-if="+type === 1">
				<div class="g-col">
					<span v-if="it.status != 1" class="g-c-333 g-fs-14">
						{{ it.remark }}
					</span>
					<span v-if="+it.prize_type === 2" style="color: #E11221;">
						+￥{{ it.cost_price }}
					</span>
				</div>

				<div
					v-if="+it.status === 1"
					class="g-c-white __button g-fs-13"
					@click.stop="handleGoResult"
				>
					兑奖
				</div>

				<div v-else class="g-c-333 g-fs-14">
					{{ ['已兑奖','已失效'][it.status - 2] }}
				</div>
			</template>
			<template v-else>
				<div class="g-col g-fs-15">
					<span class="g-c-0">
						{{ ['预计奖励：','奖励入账：','该订单已退款'][+it.reward_grant_status] }}
					</span>
					<span
						v-if="it.reward_grant_status != 2"
						:style="{color: it.reward_grant_status ? '#E11221' : '#000000'}"
					>
						+￥{{ it.reward_amount }}
					</span>
				</div>
				<div
					:style="{color: it.reward_grant_status ? '#666666' : '#FF3C4A'}"
					class="g-fs-14"
				>
					{{ it.reward_grant_status_name }}
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import { MToast } from '@wya/vc';
import { OSS } from '@constants/constants';
import { Reward } from './modal/reward';

export default {
	name: "xls-item",
	props: {
		it: Object,
		type: {
			type: String
		}
	},
	data() {
		return {
			bg: ['#87A6F4', '#E11221', '#625277'],
			M_19: OSS.M_19
		};
	},
	methods: {
		handleInit() {
			this.$store.commit('REWARD_LIST_INIT');
		},
		handleGoDetail() {
			this.$router.push({
				path: '/reward-detail',
				query: {
					type: this.type,
					prize_exchange_id: +this.type === 1 ? this.it.prize_exchange_id : '',
					orders_reward_id: +this.type === 2 ? this.it.orders_reward_id : ''
				}
			});
		},
		handleGoResult() {
			this.$request({
				url: "_REWARD_PRIZE_EXCHANGE_POST",
				type: "POST",
				param: {
					prize_exchange_id: this.it.prize_exchange_id
				},
				loading: false,
				successTip: false
			}).then(res => {
				if (+res.data.exchange_type === 2 || (+res.data.exchange_type === 1 && +res.data.is_send === 0)) {
					this.$router.push({
						path: '/reward-result',
						query: {
							prize_exchange_id: res.data.prize_exchange_id,
							exchange_type: res.data.exchange_type
						}
					});
				} else {
					Reward.popup({
						prizeType: +res.data.prize_type
					}).catch(e => {
						e && console.error(e);
					}).finally(() => {
						this.handleInit();
						this.$vc.emit('REWARD_LIST_HEADER_UPDATE');
					});
				}
			}).catch(res => {
				MToast.info(res.msg, 1);
			});
		}
	}
};
</script>

<style lang="scss">
.v-reward-list-item {
	._product {
		width: 60px;
		height: 60px;
	}

	._label {
		padding: 0px 6px;
		border-radius:4px;
	}

	._footer {
		height: 44px;

		.__button {
			width: 80px;
			height: 28px;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #26BE76;
			border-radius:5px;
		}
	}

	._nick {
		width: 25px;
		height: 25px;
		border-radius: 50%;
	}
}
</style>
