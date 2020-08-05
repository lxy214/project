<template>
	<vcm-tabs 
		:value="type" 
		:animated="false"
		@click="handleChange"
	>
		<vcm-tabs-pane 
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label" 
			:name="item.value"
		>
			<div v-if="tableList.length==0" class="g-m-t-16 g-tc">
				暂无数据
			</div>
			<xls-item
				v-for="(element,index) in tableList"
				:key="index"
				:it="element"
				class="_item" 
			/>
		</vcm-tabs-pane>
	</vcm-tabs>
</template>

<script>
import Item from './item';

export default {
	name: 'xls-table',
	components: {
		'xls-item': Item
	},
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '全部', value: '0' }, 
				{ label: '提现中', value: '1' }, 
				{ label: '已提现', value: '2' }
			],
			tableList: []
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			return this.$request({
				url: '_REWARD_CASH_LIST_GET',
				type: 'GET',
				param: {
					type: this.type
				}
			}).then((res) => {
				this.tableList = [];
				if (!res.data.length) {
					for (const key in res.data) {
						this.tableList.push({
							month: key,
							...res.data[key]
						});
					}
				}
			}).catch((error) => {
				console.error(error, 'error');
				this.tableList = [];
			});
		},
		handleChange(type) {
			this.type = type;
			this.loadData();
		}
	}
};
</script>

<style lang="scss">
</style>