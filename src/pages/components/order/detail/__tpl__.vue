<template>
	<div v-if="info.orders.orders_id" class="v-order-detail g-flex g-fd-c">
		<div class="g-col" style="overflow: auto;">
			<div class="_header g-relative g-flex g-ai-c g-pd-l-12 g-m-b-8">
				<span class="g-fs-18 g-c-white">{{ orderStatus }}</span>
				<vcm-img
					:src="OSS[statusImgs[info.orders.orders_status]]"
					class="_header-img"
				/>
			</div>
			<div
				v-if="info.orders.delivery_type === 1 && delivery.context"
				class="_delivery g-flex g-ai-c g-bg-white g-pd-r-12 g-pd-l-8 g-bb"
				@click="handleToTransport"
			>
				<vc-icon type="m-logistics" class="g-fs-18 g-m-r-8" />
				<div class="g-fs-14 g-pd-r-12">
					<div class="g-c-main g-twoline">
						{{ delivery.context }}
					</div>
					<span class="g-c-999">{{ delivery.time }}</span>
				</div>
				<vcm-icon type="right" />
			</div>
			<template v-if="info.orders.delivery_type === 1">
				<div class="_address g-bg-white g-flex g-jc-c g-fd-c g-pd-lr-10 g-pd-tb-10">
					<span class="g-fs-14 g-c-333 g-pd-l-20 g-m-b-5">
						{{ `收货人：${info.address.consignee} ${info.address.mobile}` }}
					</span>
					<div class="g-flex g-ai-c">
						<vc-icon type="address" class="g-fs-16 g-m-r-5" />
						<span>{{ `收货地址：${locationStr}` }}</span>
					</div>
				</div>
				<div class="g-letter-border g-m-b-8" />
			</template>
			<div class="_product g-bg-white">
				<div class="_activity g-flex g-jc-sb g-ai-c g-col g-pd-lr-10">
					<div class="g-flex g-ai-c">
						<span class="_tag g-m-r-5 g-c-white">{{ info.orders.activity_tool_type }}</span>
						<span class="g-fs-14 g-c-333">{{ subStrText(info.orders.activity_name, 9) }}</span>
					</div>
					<div class="g-flex g-ai-c">
						<vc-img :src="info.invite_user.head_img_url" class="g-imgc-24 g-m-r-5" />
						<span class="g-fs-14 g-c-333">{{ subStrText(info.invite_user.nick_name, 4) }}</span>
					</div>
				</div>
				<div
					v-for="item in info.product"
					:key="item.product_id"
					class="_product-info g-flex g-ai-fs g-pd-12 g-bb"
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
			</div>
			<div class="g-row-group g-fs-14 g-c-000">
				<div class="g-row-item g-flex g-jc-sb">
					<span>商品总价</span>
					<span>¥{{ info.orders.product_amount }}</span>
				</div>
				<div class="g-row-item g-flex g-jc-sb">
					<span>运费</span>
					<span v-if="info.orders.delivery_type === 1">
						{{ info.orders.freight_amount == 0 ? '包邮' : '¥' + info.orders.freight_amount }}
					</span>
					<span v-else>
						无需物流
					</span>
				</div>
				<div class="g-row-item g-flex g-jc-sb">
					<span>合计</span>
					<span>¥{{ info.orders.orders_amount }}</span>
				</div>
				<a v-if="info.contact.open_contact_phone" :href="`tel:${info.contact.contact_phone}`">
					<div class="g-row-item g-flex-cc">
						<vcm-icon type="service" class="g-fs-24 g-m-r-5" style="color: #26BE76;" />
						<span class="g-fs-14 g-c-000">售后电话</span>
					</div>
				</a>
			</div>
			<div class="_order g-bg-white g-pd-tb-10 g-pd-l-12 g-fs-13">
				<div class="_order-item g-flex g-ai-c g-pd-tb-5">
					<span class="_order-item-label">订单号：</span>
					<div>
						<span class="g-m-r-8">{{ info.orders.orders_sn }}</span>
						<vcm-clipboard
							:value="info.orders.orders_sn"
							tag="span"
						>
							<span class="g-c-main">复制</span>
						</vcm-clipboard>
					</div>
				</div>
				<div class="_order-item g-flex g-ai-c g-pd-tb-5">
					<span class="_order-item-label">下单时间：</span>
					<span>{{ info.orders.orders_time }}</span>
				</div>
				<div class="_order-item g-flex g-ai-c g-pd-tb-5">
					<span class="_order-item-label">支付方式：</span>
					<span>{{ info.orders.pay_type == 1 ? '微信' : '' }}</span>
				</div>
				<div class="_order-item g-flex g-ai-c g-pd-tb-5">
					<span class="_order-item-label">支付时间：</span>
					<span>{{ info.orders.pay_time }}</span>
				</div>
				<div v-if="info.orders.deliver_time" class="_order-item g-flex g-ai-c g-pd-tb-5">
					<span class="_order-item-label">发货时间：</span>
					<span>{{ info.orders.deliver_time }}</span>
				</div>
				<div v-if="info.orders.refund_time" class="_order-item g-flex g-ai-c g-pd-tb-5">
					<span class="_order-item-label">退款时间：</span>
					<span>{{ info.orders.refund_time }}</span>
				</div>
				<div v-if="info.orders.receipt_time" class="_order-item g-flex g-ai-c g-pd-tb-5">
					<span class="_order-item-label">完成时间：</span>
					<span>{{ info.orders.receipt_time }}</span>
				</div>
			</div>
		</div>
		<div
			v-if="info.orders.orders_status === 3"
			class="g-bg-white g-flex g-jc-fe g-pd-r-12 g-ai-c"
			style="height: 48px;box-shadow: 0px -3px 5px -5px #999; z-index: 10;"
		>
			<div
				class="_confirm-delivery g-c-white"
				@click="handleConfirmDelivery"
			>
				确认收货
			</div>
		</div>
	</div>
</template>

<script>
import { OSS } from '@constants/constants';
import { MModal } from '@wya/vc';
import { treeForEach } from '@utils/utils';
import service from '@stores/services/common';

export default {
	name: 'v-order-detail',
	components: {
	},
	mixins: [service.region()],
	data() {
		return {
			OSS,
			statusImgs: {
				2: 'M_6',
				3: 'M_5',
				11: 'M_4',
				22: 'M_9'
			},
			info: {
				orders: {},
				product: [{}],
				address: {},
				invite_user: {}
			},
			delivery: {

			}
		};
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
			return map[this.info.orders.orders_status];
		},
		locationStr() {
			const {
				province_code,
				city_code,
				area_code,
				address
			} = this.info.address;
			let provinceName;
			let cityName;
			let areaName;
			treeForEach(this.region, (node) => {
				if (node.value === province_code) {
					provinceName = node.label;
				} else if (node.value === city_code) {
					cityName = node.label;
				} else if (node.value === area_code) {
					areaName = node.label;
				}
			});
			return provinceName + ' ' + cityName + ' ' + areaName + ' ' + address;
		}
	},
	created() {
		this.loadOrderDetail();

	},
	methods: {
		loadOrderDetail() {
			this.$request({
				url: '_ORDER_DETAIL_GET',
				type: 'GET',
				param: {
					orders_id: this.$route.query.orders_id
				}
			}).then(res => {
				this.info = res.data;
				this.info.orders.express_code && this.loadDelivery();
			}).catch(e => {
				console.error(e);
			});
		},
		loadDelivery() {
			this.$request({
				url: '_ORDER_DETAIL_DELIVERY_GET',
				type: 'GET',
				param: {
					company_code: this.info.orders.express_code,
					logistics_number: this.info.orders.delivery_sn
				}
			}).then(res => {
				this.delivery = res.data[0];
			}).catch(e => {
				console.error(e);
			});
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
							orders_id: this.info.orders.orders_id
						}
					}).then(res => {
						this.loadOrderDetail();
					});
				},
			});
		},
		handleToTransport() {
			this.$router.push(`/order-transport?orders_id=${this.info.orders.orders_id}`);
		},
		subStrText(v, length = 10) {
			return v.length > length ? v.substr(0, length) + '...' : v;
		}
	},
};
</script>

<style lang="scss">
.v-order-detail {
	._header {
		width: 100%;
		background: linear-gradient(133deg,rgba(49,38,73,1),rgba(98,82,119,1));
		height: 112px;
		._header-img {
			width: 86px;
			position: absolute;
			right: 35px;
			top: 50%;
			transform: translate(0, -50%);
		}
	}
	._address {
		min-height: 90px;
	}
	._product {
		._activity {
			height: 44px;
		}
		._tag {
			padding: 0px 4px;
			background: #8F96E7;
			border-radius: 2px;
		}
		._product-info {
			background: #FAF7FA;
		}
	}
	._delivery {
		height: 84px;
	}
	._order {
		._order-item-label {
			display: inline-block;
			width: 72px;
		}
	}
	._confirm-delivery {
		padding: 5px 14px;
		background: #26BE76;
		border-radius: 5px;
	}
}
</style>
