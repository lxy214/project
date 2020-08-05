<template>
	<set-title title="404">
		<div class="g-flex-cc g-fd-c g-pd-20">
			<p class="g-c-333 g-fs-20 g-lh-20 g-pd-20">
				网页地址错误（404）
			</p>
			<!-- <vc-button 
				v-if="showBack" 
				@click="handleBack" 
			>
				点击返回
			</vc-button> -->
		</div>
	</set-title>
</template>

<script>
export default {
	name: 'xls-not-found',
	components: {
	},
	data() {
		return {
			showBack: false,
		};
	},
	created() {
		this.setShowBack();
	},
	methods: {
		setShowBack() {
			if (window.history.length <= 1) {
				this.showBack = false;
			} else {
				this.showBack = true;
			}
		},
		handleBack() {
			this.$router.back();
		}
	}
};
</script>