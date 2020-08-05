<template>
	<div :key="it.id" class="v-order-list-item g-b g-m-b-10">
		<div class="g-flex g-ai-c g-jc-sb g-bb g-pd-lr-12 g-pd-tb-12 g-bg-white">
			<div class="g-flex g-ai-c g-col g-m-r-10">
				<span class="_tag g-m-r-5">{{ it.activity_tool_type }}</span>
				<span class="g-fs-14 g-c-333 g-oneline g-col">{{ it.activity_name }}</span>
			</div>
			<span class="g-fs-14" style="color: #FF3C4A;">
				{{ orderStatus }}
			</span>
		</div>
		<div
			v-for="item in it.product"
			:key="item.product_id"
			class="_product-info g-flex g-ai-fs g-pd-12 g-bb"
			@click="handleToDetail"
		>
			<vcm-img
				:src="item.image_url"
				class="g-m-r-8"
				style="width: 78px; height: 78px; border-radius: 2px;"
			/>
			<div class="g-flex g-fd-c g-col g-ai-fs">
				<span class="g-twoline g-c-000 g-fs-15">
					{{ item.product_name }}
				</span>
				<div
					class="g-c-999 g-fs-11 g-bg-white g-m-tb-8"
					style="border-radius: 2px; padding: 2px 5px;"
				>
					{{ item.sku_value }}
				</div>
				<div class="g-flex g-jc-sb g-ai-c" style="width:100%">
					<div class="g-fs-15">
						<span class="g-m-r-8" style="color: #FF3C4A;">
							¥{{ item.activity_price }}
						</span>
						<span
							class="g-c-999"
							style=" text-decoration: line-through;"
						>
							¥{{ item.price }}
						</span>
					</div>
					<span class="g-fs-13 g-c-333">x{{ item.quantity }}</span>
				</div>
			</div>
		</div>
		<div class="g-flex g-jc-fe g-pd-tb-10 g-pd-r-12 g-bg-white g-fs-15 g-c-000 g-bb">
			<span>{{ `合计：¥${it.pay_amount}` }}</span>
			<span>{{ `（${it.delivery_type === 1 ? '含运费' : '无需物流'}）` }}</span>
		</div>
		<div
			v-if="it.orders_status === 3"
			class="g-flex g-jc-fe g-pd-tb-10 g-pd-r-12 g-bg-white"
		>
			<div
				class="_check-logistics g-fs-13 g-m-r-12"
				@click="handleToTransport"
			>
				查看物流
			</div>
			<div
				class="_confirm-delivery g-c-white g-fs-13"
				@click="handleConfirmDelivery"
			>
				确认收货
			</div>
		</div>
	</div>
</template>

<script>
import { MModal } from '@wya/vc';

export default {
	name: "v-order-list-item",
	props: {
		it: Object,
	},
	computed: {
		orderStatus() {
			let map = {
				1: '待支付',
				2: '待发货',
				3: '待收货',
				11: '已完成',
				21: '已取消',
				22: '已退款'
			};
			return map[this.it.orders_status];
		}
	},
	methods: {
		handleInit() {
			this.$store.commit('ORDER_LIST_INIT');
		},
		handleConfirmDelivery() {
			MModal.alert({
				content: (h) => {
					return (
						<div class="g-tc g-fs-18">
							<span>是否确认收货</span>
						</div>
					);
				},
				onOk: () => {
					this.$request({
						url: '_ORDER_LIST_CONFIRM_DELIVERY_POST',
						type: 'POST',
						param: {
							orders_id: this.it.orders_id
						}
					}).then(res => {
						this.handleInit();
					});
				},
			});
		},
		handleToDetail() {
			this.$router.push(`/order-detail?orders_id=${this.it.orders_id}`);
		},
		handleToTransport() {
			this.$router.push(`/order-transport?orders_id=${this.it.orders_id}`);
		}
	}
};
</script>
<style lang="scss">
.v-order-list-item {
	._tag {
		padding: 0px 6px;
		color: $white;
		background: #8F96E7;
		border-radius: 2px;
	}
	._product-info {
		background: #FAF7FA;
	}
	._check-logistics {
		padding: 5px 14px;
		background: $white;
		border-radius: 5px;
		border: 1px solid #999;
	}
	._confirm-delivery {
		padding: 5px 14px;
		background: #26BE76;
		border-radius: 5px;
	}
}
</style>
