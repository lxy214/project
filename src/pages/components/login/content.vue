<template>
	<vcm-form 
		v-if="$global.debug"
		ref="form" 
		:model="formValidate" 
		:label-width="96"
		style="height: 100vh; width: 100vw" 
		label-position="left"
		class="g-fd-c g-bg-white"
		@submit.native.prevent
	>	
		<!-- flex下vcm-form-item 要使用flex: 1 -->
		<vcm-form-item label="Token：" prop="token" required>
			<vcm-input v-model="formValidate.token" placeholder="请输入Token" />
		</vcm-form-item>
		<vcm-form-item label="invite_user_id" prop="invite_user_id">
			<vcm-input v-model="formValidate.invite_user_id" placeholder="选填invite_user_id" />
		</vcm-form-item>
		<vcm-form-item label="ActiveID：" prop="activity_id">
			<vcm-input v-model="formValidate.activity_id" placeholder="选填activity_id" />
		</vcm-form-item>

		<vcm-form-item>
			<vcm-button class="g-m-t-24" type="primary" @click="handleLogin">
				登录
			</vcm-button> 	
		</vcm-form-item>
	</vcm-form>
</template>

<script>
import { MToast } from '@wya/vc';
import { Storage, Cookie, URL } from '@utils/utils';
import { createLoginAuth } from '@routers/hooks';
import { USER_KEY } from '@constants/constants';

const formValidate = {
	token: URL.get('token') || 'a65b15bf54f8715a653ad0b73df9f6da',
	activity_id: URL.get('activity_id') || undefined,
	invite_user_id: URL.get('invite_user_id') || undefined
};

export default {
	name: 'login',
	components: {
	},
	data() {
		return {
			formValidate
		};
	},
	computed: {
	},
	created() {
		
	},
	methods: {
		async handleLogin() {
			try {
				await this.$refs.form.validate();
				/**
				 * 伪登录，很重要
				 */
				let res = await this.$request({
					url: 'LOGIN_MAIN_POST',
					type: 'POST',
					headers: {
						token: this.formValidate.token,
						activityId: this.formValidate.activity_id,
						inviteUserId: this.formValidate.invite_user_id,
					},
					localData: null
				});
				
				createLoginAuth({
					...res.data,
					token: this.formValidate.token,
					activity_id: this.formValidate.activity_id,
					invite_user_id: this.formValidate.invite_user_id,
					__USER_CONFIG__: true
				});

			} catch (e) {
				e.status && MToast.info(e.msg);
				console.log(e);
			}
		}
	},
};
</script>

<style lang="scss">
</style>
