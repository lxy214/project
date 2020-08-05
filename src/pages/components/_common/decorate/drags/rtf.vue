<template>
	<div :style="{ top: `${y}px`, padding: `0 ${pd_lr}px`,}" class="vm-drags-rtf-viewer">
		<vcm-editor-view
			v-if="content"
			:style="{ background: `${bg}`}"
			:content="content"
			class="vm-drags-rtf-viewer__content"
		/>
	</div>
</template>

<script>
/* eslint-disable vue/prop-name-casing */

export default {
	name: 'vm-drags-rtf-viewer',
	props: {
		id: String,
		content: String,
		bg: String,
		pd_lr: Number,
		x: Number,
		y: Number,
		z: Number,
		w: Number,
		h: Number,
		r: Number,
	},
	data() {
		return {
		};
	},
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/bem.scss";
$block: vm-drags-rtf-viewer;

@include block($block) {
	overflow: hidden;
	position: absolute;
	width: 100%;
	@include element(content) {
		line-height: 22px;
		padding: 0;
		overflow: hidden;
		width: 100%;
	}
	.ql-editor {
		padding: 8px 12px;
		line-height: 22px;
		img {
			width: 100vw;
		}
	}

}

</style>
