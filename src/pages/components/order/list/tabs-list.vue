<template>
	<div>
		<vcm-tabs
			:value="type"
			:animated="false"
			class="v-order-list"
			@click="handleChange"
		>
			<vcm-tabs-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="labelHtml(item)"
				:name="item.value"
			>
				<vc-pull-scroll
					:show="item.value == type"
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:count="listInfo[item.value].count"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:height="scrollHeight"
					wrapper
				>
					<template #default="{ it }">
						<xls-item :it="it" class="_item" />
					</template>
				</vc-pull-scroll>
			</vcm-tabs-pane>
		</vcm-tabs>
		<dxb-fix-qrcode />
	</div>
</template>

<script>
import { URL } from '@utils/utils';
import QrCode from '@common/qrcode/qrcode';
import Item from './item';

export default {
	name: 'v-order-list',
	components: {
		'xls-item': Item,
		'dxb-fix-qrcode': QrCode
	},
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '全部', value: '0' },
				{ label: '待发货', value: '1' },
				{ label: '待收货', value: '2' },
				{ label: '已完成', value: '3' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.orderList.listInfo;
		},
		tip() {
			return {
				...this.$store.state.orderList.tip,
				'0': 0
			};
		},
		scrollHeight() {
			return window.innerHeight - 53 - this.$global.navHeight;
		}
	},
	methods: {
		loadData(page, refresh) {
			let { query = {} } = URL.parse();
			return this.request({
				url: 'ORDER_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize: 10,
				},
				refresh
			}).then((res) => {
				console.log(res, 'res');
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = URL.parse(); // this.$route需要设置scroll.sync
			query = {
				...query,
				type,
			};
			this.$router.replace(URL.merge({ path: '/order-list', query }));
		},
		labelHtml(item) {
			return (h) => {
				return (
					<div>
						<div style="position: relative; display: inline-block;">
							<span>{item.label}</span>
							<div
								v-show={this.tip[item.value] > 0}
								class="_tab-label-wrap"
								style={{ right: this.tip[item.value] < 10
									? '-14px' : this.tip[item.value] < 100
										? '-20px' : '-28px' }}
							>
								<span
									class="_tab-label"
								>
									{this.tip[item.value] > 99 ? '99+' : this.tip[item.value]}
								</span>
							</div>
						</div>
					</div>
				);
			};
		},
	}
};

</script>

<style lang="scss">
.v-order-list {
	._tab-label-wrap {
		position: absolute;
		top: -8px;
		background: red;
		border-radius: 12px;
		color:#fff;
		padding: 0px 5px 1px 5px;
		._tab-label {
			font-size: 12px;
			transform: scale(0.8);
			line-height: 10px;
		}
	}
}
</style>
