<template>
	<xls-link
		v-if="show"
		:style="[{
			background: `${bg}`,
			margin: `${m_tb}px 0`,
			color: `${color}`,
			'font-size': `${fs}px`,
			'justify-content': `${position === 'left'
				? 'flex-start'
				: (position === 'center' ? 'center' : 'flex-end')}`,
			'padding-right': `${(position === 'right' && show_arrow) ? '24px' : '10px'}`
		}]"
		:enhancer="[5].includes(link_id)"
		:primary-key="link_id"
		:to="link"
		class="vm-basic-title-viewer"
	>
		<span>{{ title }}</span>
		<vcm-icon
			v-show="show_arrow"
			type="right"
			class="vm-basic-title-viewer__arrow"
		/>
	</xls-link>
</template>

<script>
/* eslint-disable vue/prop-name-casing */

export default {
	name: 'vm-basic-title-viewer',
	props: {
		bg: String,
		color: String,
		m_tb: Number, // 上下边距,
		fs: Number,
		title: String,
		show_arrow: Number,
		position: { // left center right
			type: String,
			validator: (value) => {
				return ['left', 'center', 'right'].includes(value);
			}
		},
		link: String,
		link_id: [String, Number],
		show: Number
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
$block: vm-basic-title-viewer;

@include block($block) {
	width: 100%;
	display: flex;
	position: relative;
	align-items: center;
	padding: 12px 0px 12px 10px;
	@include element(arrow) {
		font-size: 12px;
		color: #999;
		position: absolute;
		top: 50%;
		right: 6px;
		transform: translate(0, -45%);
	}
}
</style>
