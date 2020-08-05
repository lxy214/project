<template>
	<div
		v-show="show"
		:style="{ backgroundColor: `${bg}`, margin: `${m_tb}px 0` }"
		class="vm-basic-notice-viewer"
	>
		<div>
			<span class="vm-basic-notice-viewer__tag ">公告</span>
			<div class="vm-basic-notice-viewer__content">
				<vcm-marquee
					:style="{ color: `${color}` }"
					class="vm-basic-notice-viewer__text"
				>
					{{ content || '' }}
				</vcm-marquee>
			</div>
		</div>
		<vcm-icon
			type="close"
			class="vm-basic-notice-viewer__close"
			@click="handleClose"
		/>
	</div>
</template>

<script>
/* eslint-disable vue/prop-name-casing */

export default {
	name: 'vm-basic-notice-viewer',
	props: {
		id: String,
		content: String,
		color: String,
		m_tb: Number,
		bg: String,
	},
	data() {
		return {
			show: false
		};
	},
	computed: {
	},
	created() {
		this.show = true;
	},
	methods: {
		handleClose() {
			this.show = false;
		}
	},
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/bem.scss";
$block: vm-basic-notice-viewer;
$red: #ff3c4a;

@include block($block) {
	position: relative;
	height: 37px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	overflow: hidden;
	padding-right: 12px;
	>div {
		flex: 1;
		display: flex;
		align-items: center;
		overflow: hidden;
		padding: 0 10px 0 12px;
	}
	@include element(tag) {
		color: $red;
		background: rgba($red, 0.1);
		padding: 1px 7px;
		border-radius: 2px;
		font-size: 11px;
		position: relative;
		top: -1px;
		margin-right: 8px;
	}
	@include element(content) {
		font-size: 13px;
		flex: 1;
		overflow: hidden;
		display: flex;
		align-items: center;
		@include element(text) {
			width: 100%;
			white-space: nowrap;
			line-height: 23px;
		}
	}
	@include element(close) {
		color: $red;
		font-size: 11px;
	}
}

</style>
