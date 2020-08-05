<template>
	<div class="vm-basic-rtf-viewer">
		<vcm-editor-view
			v-if="content"
			:style="[{ background: `${bg}`, margin: `${m_tb}px 0`}]"
			:content="content"
			class="vm-basic-rtf-viewer__content"
		/>
	</div>
</template>

<script>
/* eslint-disable vue/prop-name-casing */

export default {
	name: 'vm-rtf-viewer',
	props: {
		id: String,
		content: String,
		m_tb: Number,
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
$block: vm-basic-rtf-viewer;

@include block($block) {
	overflow: hidden;
	@include element(content) {
		line-height: 22px;
		padding: 0;
		overflow: hidden;
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
