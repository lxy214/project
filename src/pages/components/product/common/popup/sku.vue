<template>
	<div class="v-product-c-sku-item">
		<div v-for="(item,index) in sku.filter(ele=>selected[deep]===undefined ?index===0: ele.value ===selected[deep]) " :key="index">
			<div class="g-c-0 g-fs-14 g-m-tb-8">
				{{ item.spec_name }}
			</div>
			<span
				v-for="(item2,index2) in sku"
				:key="index2"
				class="_sku-label"
				:class="{_active:selected[deep]===item2.value,_disabled:!item2.valid}"
				@click="handleClick(item2,deep)"
			>

				{{ item2.label }}
				<!-- {{ item2.value }}{{ selected }}{{ deep }} -->
			</span>
			<xls-sku 
				v-if="item.children && item.children.length && (selected[deep]===undefined ?index===0: item.value ===selected[deep])"
				:sku="item.children"
				:selected="selected"
				:deep="deep+1"
				@click="handleClick"
			/>
		</div>
	</div>
</template>
<script>

export default {
	name: 'xls-sku',
	components: {


	},
	props: {
		sku: Array,
		deep: {
			type: Number,
			default: 0
		},
		selected: {
			type: Array,
			default: () => []
		}

	},
	data() {
		return {
		};
	},
	methods: {
		handleClick(item2, deep) {
			if (!item2.valid) this.$Toast.info('该规格已售罄');
			else this.$emit('click', item2, deep);

		}
	}
};
</script>
<style lang="scss">
.v-product-c-sku-item {
	._sku-label {
		background: #f2f2f2;
		color: #515151;
		padding: 6px 8px 6px 8px;
		border-radius: 16px;
		display: inline-block;
		margin-right: 8px ;
		margin-bottom: 8px;

		&._active {
			background: rgba(255, 60, 74,0.1);
			color: rgb(255, 60, 74);
			
		}
		&._disabled {
			background: rgba(242, 242, 242,0.2);
			color: rgba(81, 81, 81,0.2);
		}

	}

}
</style>