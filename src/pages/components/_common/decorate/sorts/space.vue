<template>
	<div :style="[{ height: `${h ? `${h}px` : 'auto' }`, backgroundColor: `${bg}` }]" />
</template>

<script>
/* eslint-disable vue/prop-name-casing */
export default {
	name: 'vm-space-viewer',
	components: {
	},
	props: {
		id: String,
		bg: String,
		h: Number,
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
</style>
