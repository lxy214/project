<template>
	<div class="vm-basic-nav-viewer">
		<div
			:style="[{ background: `${bg}`, margin: `${m_tb}px 0`, color: `${color}` }]"
			class="vm-basic-nav-viewer__content"
		>
			<xls-link
				v-for="(item, index) in newList"
				:key="index"
				:style="[{
					padding: `${type === 2 ? '0' : '8px 0'}`,
					'flex-direction': `${layout === 1 ? 'column-reverse' : 'column'}`,
					'margin-right': `${type === 2
						&& newList.length
						&& index !== (newList.length - 1)? '0px' : '0px'}`,
					'min-width':`${slide_type === 2 ? '20%' : 'none'}`
				}]"
				:enhancer="[5].includes(item.id)"
				:primary-key="item.id"
				:to="item.url"
				class="vm-basic-nav-viewer__item"
			>
				<div
					v-if="type !== 3"
					:style="[{
						'background-image': `url('${item.img[0]}')`,
						'border-radius': `${icon_type === 1 ? '50%' : ''}`,
						width: `${type === 2 ? '100%' : '44px'}`,
						height: `${type === 2 ? '84px' : '44px'}`
					}]"
					class="vm-basic-nav-viewer__img"
				/>
				<span
					v-if="type !== 2"
					:style="{
						'margin-top': `${type === 1 ? '6px' : '0px'}`
					}"
					class="vm-basic-nav-viewer__text"
				>
					{{ item.name }}
				</span>
			</xls-link>
		</div>
	</div>
</template>

<script>

/* eslint-disable vue/prop-name-casing */
export default {
	name: 'vm-basic-nav-viewer',
	components: {
	},
	props: {
		type: Number, // 1图文 2图片 3文字
		bg: String,
		color: String,
		m_tb: Number, // 上下边距,
		icon_type: Number, // 1原型 2方形
		slide_type: Number, // 1固定 2滑动
		layout: Number, // 1文字在上 2文字在下
		list: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
		};
	},
	computed: {
		newList() {
			return this.list.filter(item => item.show);
		}
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/bem.scss";
$block: vm-basic-nav-viewer;

@include block($block) {
	overflow: hidden;
	@include element(content) {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
	}
	@include element(item) {
		display: flex;
		flex: 1;
		min-height: 44px;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		&:hover {
			color: inherit;
		}
		@include element(img) {
			width: 28px;
			height: 28px;
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
		}
		@include element(text) {
			font-size: 12px;
		}
	}
}
</style>
