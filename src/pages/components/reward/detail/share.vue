<template>
	<div class="v-reward-detail-share">
		<div class="g-m-t-10 g-bg-white g-pd-12 g-fs-14">
			<div>
				<span :style="{color: dataSource.reward_grant_status != 2 ? '#333333' : '#FF404E'}">
					{{ ['预计奖励金额','奖励入账','该订单已退款，奖励佣金全被撤回'][+dataSource.reward_grant_status] }}
				</span>
				<div
					v-if="dataSource.reward_grant_status == 2"
					style="color: #FF404E;"
				>
					预计奖励金额
				</div>
				<span
					style="color: #FF404E;"
				>
					￥{{ dataSource.reward_amount }}
				</span>
			</div>
			<div v-if="+dataSource.reward_grant_status === 0 && dataSource.auto_receipt_time" class="g-m-t-12 g-c-3">
				{{ dataSource.auto_receipt_time }}前结算
			</div>
			<div v-if="+dataSource.reward_grant_status === 1 && dataSource.reward_grant_time" class="g-m-t-12 g-c-3">
				{{ dataSource.reward_grant_time }}入账成功
			</div>
		</div>

		<div class="g-m-t-10 g-bg-white">
			<div class="g-flex g-flex-ac g-jc-sb g-pd-lr-12 g-fs-14 g-c-3 _head">
				<div>{{ dataSource.activity_name }}</div>
				<div>
					下单人
					<img
						:src="dataSource.orders_user_head_img"
						class="g-m-lr-8 __nick"
					>
					{{ dataSource.orders_user_nick_name }}
				</div>
			</div>

			<div class="g-bg-f8 g-pd-t-12 g-pd-lr-12 g-pd-b-30">
				<div
					v-for="(item,index) in dataSource.product_list"
					:key="index"
					class="g-flex"
				>
					<img
						:src="(item.image_url || M_19) +'!2-2'"
						class="_product"
					>
					<div class="g-m-l-15">
						<div>
							<div class="g-c-000 g-fs-15">
								{{ item.product_name }}
							</div>
							<span class="g-inline-block g-m-tb-5 g-c-9 _label">
								{{ handleData(item.sku_value) }}
							</span>
						</div>
						<div class="g-fs-15">
							<span style="color: #FF3C4A;">￥{{ item.activity_price }}</span>
							<span class="g-c-9" style="text-decoration: line-through;">￥{{ item.price }}</span>
						</div>
					</div>
				</div>
			</div>

			<div class="g-pd-l-12 g-fs-14 g-c-0">
				<div class="g-flex g-jc-sb g-pd-r-12 g-bb _item">
					<span>商品总价</span>
					<span>￥{{ dataSource.product_amount }}</span>
				</div>
				<div class="g-flex g-jc-sb g-pd-r-12 g-bb _item">
					<span>运费</span>
					<span>￥{{ dataSource.freight_amount }}</span>
				</div>
				<div class="g-flex g-jc-sb g-pd-r-12 _item">
					<span>合计</span>
					<span>￥{{ dataSource.orders_amount }}</span>
				</div>
			</div>
		</div>

		<div class="g-m-t-10 g-bg-white g-pd-15 g-fs-13 g-c-3">
			<div class="g-m-b-16">
				<span class="g-inline-block g-tr" style="width: 96px;">订单号：</span>
				<span>{{ dataSource.orders_sn }}</span>
			</div>
			<div class="g-m-b-16">
				<span class="g-inline-block g-tr" style="width: 96px;">佣金编号：</span>
				<span>{{ dataSource.reward_sn }}</span>
			</div>
			<div class="g-m-b-16">
				<span class="g-inline-block g-tr" style="width: 96px;">下单时间：</span>
				<span>{{ dataSource.orders_create_time }}</span>
			</div>
			<div class="g-m-b-16">
				<span class="g-inline-block g-tr" style="width: 96px;">支付方式：</span>
				<span>{{ dataSource.pay_type_name }}</span>
			</div>
			<div class="g-m-b-16">
				<span class="g-inline-block g-tr" style="width: 96px;">支付时间：</span>
				<span>{{ dataSource.orders_pay_time }}</span>
			</div>
			<div v-if="dataSource.orders_deliver_time" class="g-m-b-16">
				<span class="g-inline-block g-tr" style="width: 96px;">发货时间：</span>
				<span>{{ dataSource.orders_deliver_time }}</span>
			</div>
			<div v-if="dataSource.reward_grant_status === 1" class="g-m-b-16">
				<span class="g-inline-block g-tr" style="width: 96px;">收货时间：</span>
				<span>{{ dataSource.orders_receipt_time }}</span>
			</div>
			<div v-if="dataSource.reward_grant_status === 1" class="g-m-b-16">
				<span class="g-inline-block g-tr" style="width: 96px;">奖励结算时间：</span>
				<span>{{ dataSource.reward_grant_time }}</span>
			</div>
			<div v-if="dataSource.reward_grant_status === 2" class="g-m-b-16">
				<span class="g-inline-block g-tr" style="width: 96px;">退款时间：</span>
				<span>{{ dataSource.refund_time }}</span>
			</div>
			<div v-if="dataSource.reward_grant_status === 2" class="g-m-b-16">
				<span class="g-inline-block g-tr" style="width: 96px;">结算失效时间：</span>
				<span>{{ dataSource.reward_grant_time }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { OSS } from '@constants/constants';

export default {
	props: {
		dataSource: {
			type: Object
		}
	},
	data() {
		return {
			M_19: OSS.M_19
		};
	},
	methods: {
		handleData(data) {
			return data.map(item => item.spec_value_name).join("/");
		}
	}
};
</script>

<style lang="scss">
.v-reward-detail-share {
	overflow-y: auto;

    ._head {
        height: 44px;

        .__nick {
            width: 25px;
		    height: 25px;
		    border-radius: 50%;
        }
    }

    ._product {
        max-width: 60px;
		max-height: 60px;
    }

    ._label {
        padding: 4px 6px;
        background: #FFFFFF;
        border-radius:4px;
    }

    ._item {
        height: 40px;
        line-height: 40px;
    }
}
</style>
