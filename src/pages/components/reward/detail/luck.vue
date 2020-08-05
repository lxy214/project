<template>
	<div class="v-reward-detail-luck g-pd-t-10 g-flex g-fd-c">
		<div class="g-col">
			<div class="g-m-b-10 g-bg-white g-pd-lr-8 g-pd-tb-12">
				<div class="g-c-3 g-fs-14 g-m-b-15">
					{{ dataSource.activity_name }}
				</div>

				<div class="g-bg-f8 g-pd-12 g-flex">
					<img
						:src="(dataSource.image_url || M_19) +'!2-2'"
						class="_product"
					>
					<div class="g-m-l-15">
						<div>
							<span class="g-c-000 g-fs-15">{{ dataSource.prize_name }}</span>
							<span
								:style="{background: bg[dataSource.prize_type - 1]}"
								class="g-inline-block g-c-white _label"
							>
								{{ dataSource.prize_type_name }}
							</span>
						</div>
						<div class="g-m-t-10 g-c-3 g-fs-14">
							{{ dataSource.status == 2 ? dataSource.audit_time + ' 兑奖成功' : dataSource.expire_time + ' 前兑奖' }}
						</div>
					</div>
				</div>
			</div>

			<div class="g-bg-white g-pd-tb-15 g-pd-lr-12 g-m-t-10 g-c-3 g-fs-14">
				<div class="g-m-b-16">
					<span class="g-inline-block g-tr" style="width: 80px;">中奖码：</span>
					<span>{{ dataSource.winning_code }}</span>
				</div>
				<div class="g-m-b-16">
					<span class="g-inline-block g-tr" style="width: 80px;">中奖时间：</span>
					<span>{{ dataSource.create_time }}</span>
				</div>
				<div v-if="+dataSource.status === 2" class="g-m-b-16">
					<span class="g-inline-block g-tr" style="width: 80px;">兑奖方式：</span>
					<span>{{ dataSource.exchange_type_name }}</span>
				</div>
				<div v-if="+dataSource.status === 2" class="g-m-b-16">
					<span class="g-inline-block g-tr" style="width: 80px;">兑奖时间：</span>
					<span>{{ dataSource.audit_time }}</span>
				</div>
				<div v-if="dataSource.status === 3" class="g-m-b-16">
					<span class="g-inline-block g-tr" style="width: 80px;">失效时间：</span>
					<span>{{ dataSource.expire_time }}</span>
				</div>
			</div>
		</div>

		<div v-if="dataSource.status === 1" class="g-flex g-flex-ac g-bg-white g-pd-lr-12 _footer">
			<div class="g-col" />
			<div class="g-tc g-c-white __button" @click.stop="handleGoResult">
				兑奖
			</div>
		</div>
	</div>
</template>

<script>
import { MToast } from '@wya/vc';
import { OSS } from '@constants/constants';
import { Reward } from '../list/modal/reward';

export default {
	props: {
		dataSource: {
			type: Object
		}
	},
	data() {
		return {
			bg: ['#87A6F4', '#E11221', '#625277'],
			M_19: OSS.M_19
		};
	},
	methods: {
		handleGoResult() {
			this.$request({
				url: "_REWARD_PRIZE_EXCHANGE_POST",
				type: "POST",
				param: {
					prize_exchange_id: this.dataSource.prize_exchange_id
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
					}).then(() => {
						this.$parent.loadData();
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
.v-reward-detail-luck {
    ._product {
			max-width: 60px;
			max-height: 60px;
    }

    ._label {
			padding: 0px 6px;
			border-radius:4px;
    }

    ._footer {
        width: 100%;
        height: 48px;
        bottom: 0px;

        .__button {
					width: 80px;
					height: 28px;
					line-height: 28px;
					background: #26BE76;
					border-radius:5px;
				}
    }
}
</style>
