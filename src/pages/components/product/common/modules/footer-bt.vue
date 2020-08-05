<template>
	<div>
		<vcm-portal-view>
			<div
				:style="{
					height: 48 + pd_tb * 2 + 'px'
				}"
			/>
		</vcm-portal-view>
		<div
			class="vm-attract-tool-main-bt-viewer g-bt"
			:style="{
				background: wrap_bg,
				padding: `${pd_tb}px 36px`
			}"
		>
			<div
				:style="{
					background: bg,
					color: color,
				}"
				class="vm-attract-tool-main-bt-viewer__inner"
				@click="$emit('decorate-click', { type: 'footer-button'})"
			>
				立即购买
			</div>
		</div>
	</div>
</template>

<script>
/* eslint-disable vue/prop-name-casing */
import { URL } from '@wya/utils';

export default {
	name: 'vm-attract-tool-main-bt-viewer',
	components: {
	},
	props: {
		wrap_bg: String,
		bg: String,
		color: String,
		pd_tb: Number
	},
	data() {
		return {
		};
	},
	computed: {

	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/bem.scss";
$block: vm-attract-tool-main-bt-viewer;

@include block($block) {
	position: absolute;
	width: 100%;
	z-index: 10;
	bottom: 0;
	@include element(inner) {
		width: 100%;
		height: 48px;
		border-radius: 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
	}

}
</style>
