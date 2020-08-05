<template>
	<div
		:style="[{ padding: `0 ${pd_lr}px`, backgroundColor: `${bg}`}]"
		:class="`is-layout-${layout}`"
		class="vm-basic-cut-off-viewer"
	>
		<div
			v-if="layout === 1"
			:style="[{ margin: `${m_tb}px 0`, borderBottom: `1px solid ${color}`}]"
			class="vm-basic-cut-off-viewer__line"
		/>
		<div
			v-else
			:style="[{ margin: `${m_tb}px 0`, borderBottom: `1px dotted ${color}`}]"
			class="vm-basic-cut-off-viewer__line"
		/>
		<!-- <div
			v-else
			:style="[{ margin: `${m_tb}px 0`}]"
			style="background: repeating-linear-gradient(to right, white 20%, yellow 20%)"
			class="vm-basic-cut-off-viewer__line"
		/> -->
	</div>
</template>

<script>

/* eslint-disable vue/prop-name-casing */
export default {
	name: 'vm-basic-cut-off-viewer',
	components: {
	},
	props: {
		id: String,
		layout: Number,
		m_tb: Number,
		pd_lr: Number,
		color: String,
		bg: String,
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
$block: vm-basic-cut-off-viewer;

@include block($block) {
	overflow: hidden;
	@include element(line) {
		height:1px;
		display: block;
		position: relative;
		-webkit-transform: translateZ(0);
		transform: translateZ(0);
	}
}
</style>
