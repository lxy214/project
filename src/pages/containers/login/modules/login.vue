<template>
	<div>
		<el-input v-model="userName" placeholder="请输入用户名"></el-input>
		<el-input v-model="password" placeholder="请输入密码" show-password></el-input>
		<el-button type="primary">登录</el-button>
	</div>
</template>

<script>

export default {
	name: 'login',
	components: {
		
	},
	data() {
		return {
			userName: '',
			password: '',

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
