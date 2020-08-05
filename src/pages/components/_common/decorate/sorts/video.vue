<template>
	<div
		:style="`padding: ${pd}px`"
		class="vm-basic-video-viewer"
	>
		<iframe
			:src="`https://v.qq.com/txp/iframe/player.html?vid=${src}`"
			width="100%"
			height="180"
		/>
	</div>
</template>

<script>
/* eslint-disable vue/prop-name-casing */
export default {
	name: 'vm-basic-video-viewer',
	components: {
	},
	props: {
		src: String,
		pd: Number
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
$block: vm-basic-video-viewer;

@include block($block) {

}
</style>
