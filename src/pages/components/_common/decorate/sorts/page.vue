<template>
	<div />
</template>

<script>

/* eslint-disable vue/prop-name-casing */
export default {
	name: 'vm-page-viewer',
	components: {
	},
	props: {
		id: String,
		title: Object,
		bg: String,
		bg_type: Number,
		bg_image: {
			type: Array,
			default: () => []
		},
		vm: {
			type: Object,
			default: () => ({})
		},
	},
	data() {
		return {

		};
	},
	mounted() {
		// this.title.value && (document.title = this.title.value);
		this.setPage();
	},
	beforeDestroy() {
		if (this.page) {
			this.page.style.height = 'auto';
			this.page.classList.remove('g-scroll-container');
		}
	},
	methods: {
		setPage() {
			// 待优化，g-reset 未必为一个；
			this.page = document.querySelector('._set-title-content');
			// this.page.style.height = window.innerHeight + 'px'; // set-title内统一处理, 用样式处理
			this.page.classList.add('g-scroll-container');
			if (this.bg_type == 1) {
				this.page.style.backgroundImage = 'none';
				this.page.style.backgroundColor = this.bg;
			} else {
				this.page.style.backgroundColor = 'transparent';
				this.bg_image[0] && (this.page.style.backgroundImage = `url('${this.bg_image[0]}')`);
				this.page.style.backgroundRepeat = `no-repeat`;
				this.page.style.backgroundSize = `cover`;
			}
		}
	},
};
</script>

<style lang="scss">
</style>
