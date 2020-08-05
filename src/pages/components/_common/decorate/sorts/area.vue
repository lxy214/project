<template>
	<div
		:style="{
			padding: bg_url ? '0px' : '20px 0'
		}"
		class="vm-basic-area-viewer"
	>
		<vcm-img
			v-if="bg_url"
			:draggable="false"
			:src="`${bg_url + '!1-0'}`"
			style="width: 100%; display: block;"
			class="vm-basic-area-viewer__bac"
		/>
		<xls-link
			v-for="(item, idx) in newList"
			:key="idx"
			:style="[{
				height: `${item.h}px`,
				width: `${item.w}px`,
				left: `${item.x}px`,
				top: `${item.y}px`,
				'z-index': `${item.z}`,
				border: vm.type === 'frame' ? '1px dashed #5495F6' : 'none'
			}]"
			:enhancer="[5].includes(item.p_id)"
			:primary-key="item.p_id"
			:to="item.path"
			class="vm-basic-area-viewer__item"
		>
			<div v-show="vm.type === 'frame'">
				<span style="padding: 1px 4px; background: #5495F6; color: #fff; white-space: nowrap;">
					热区{{ idx + 1 }}
				</span>
			</div>
		</xls-link>
	</div>
</template>

<script>
import { Utils } from '@wya/utils';
/* eslint-disable vue/prop-name-casing */

export default {
	name: 'vm-basic-area-viewer',
	props: {
		bg_url: String,
		list: Array,
		vm: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
		};
	},
	computed: {
		newList() {
			let arr = Utils.cloneDeep(this.list);
			let screenW = this.vm.type === 'frame' ? 375 : this.$global.width;
			return arr.map(item => {
				item.w = (item.w / 375) * screenW;
				item.h = (item.h / 375) * screenW;
				item.x = (item.x / 375) * screenW;
				item.y = (item.y / 375) * screenW;
				return item;
			});
		}
	},
	methods: {

	},
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/bem.scss";
$block: vm-basic-area-viewer;

@include block($block) {
	position: relative;
	z-index: 0;
	background: #fff;
	overflow: hidden;
	@include element(item) {
		display: inline-block;
		position: absolute;
	}
}
</style>
