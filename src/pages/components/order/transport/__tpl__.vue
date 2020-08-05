<template>
	<div class="v-order-transport">
		<div class="_product g-pd-tb-16 g-pd-lr-12 g-flex g-bg-white g-bb">
			<vcm-img
				:src="info.product[0].image_url"
				style="width: 50px; height: 50px;"
				class="g-m-r-8"
			/>
			<div class="g-flex g-fd-c g-jc-c">
				<span>{{ info.orders.express_name }}</span>
				<div>
					<span class="g-m-r-8">快递单号：{{ info.orders.delivery_sn }}</span>
					<vcm-clipboard
						:value="info.orders.delivery_sn"
						tag="span"
					>
						<span class="g-c-main">复制</span>
					</vcm-clipboard>
				</div>
			</div>
		</div>
		<div class="_address g-bg-white g-flex g-jc-c g-fd-c g-pd-10 g-bb">
			<span class="g-fs-14 g-c-333 g-pd-l-20 g-m-b-5">
				{{ `收货人：${info.address.consignee} ${info.address.mobile}` }}
			</span>
			<div class="g-flex g-ai-c">
				<vc-icon type="address" class="g-fs-16 g-m-r-5" />
				<span>{{ `收货地址：${locationStr}` }}</span>
			</div>
		</div>
		<div class="_delivery g-bg-white g-pd-12 g-pd-t-18">
			<xls-time-line v-if="logisticsData.length">
				<xls-time-line-item
					v-for="(item, i) in logisticsData"
					:key="i"
					:circle-style="i === 0 ? circleStyleBlue : circleStyle"
				>
					<div class="g-pd-b-24">
						<p :class="{ 'g-c-black' : i === 0 }" class="g-fs-16 g-lh-20 g-m-b-5">
							{{ item.context }}
						</p>
						<p class="g-fs-13 g-c-90">
							{{ item.time }}
						</p>
					</div>
				</xls-time-line-item>
			</xls-time-line>
		</div>
	</div>
</template>

<script>
import { Timeline } from "@xls/public";
import { treeForEach } from '@utils/utils';
import service from '@stores/services/common';

export default {
	name: 'v-order-transport',
	components: {
		'xls-time-line': Timeline,
		'xls-time-line-item': Timeline.Item
	},
	mixins: [service.region()],
	data() {
		return {
			info: {
				orders: {},
				product: [{}],
				address: {},
			},
			logisticsData: [],
			circleStyleBlue: {
				width: '13px',
				height: '13px',
				backgroundColor: '#4787F2'
			},
			circleStyle: {
				width: '13px',
				height: '13px',
				backgroundColor: '#e8e8e8'
			}
		};
	},
	computed: {
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
				this.logisticsData = res.data;
			}).catch(e => {
				console.error(e);
			});
		},
	},
};
</script>

<style lang="scss">
.v-order-transport {
	._address {
		min-height: 84px;
	}
}
</style>
