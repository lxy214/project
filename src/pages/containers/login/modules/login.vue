<template>
	<div>
		<login-centent />
	</div>
</template>

<script>
import Content from '@components/login/content'
export default {
	name: 'login',
	components: {
		'login-centent': Content
	},
	data() {
		return {
			

		};
	},
	created() {
		console.log('?');
	},
	methods: {
	},
};
</script>

<style>
</style>
