<template>
	<vcm-modal
		v-model="visible"
		class="v-activity-turntable-user-info"
		:footer="false"
		@cancel="handleCancel"
		@ok="handleSave"
	>
		<div slot="header" class="g-flex">
			<div class="g-pd-l-14 g-col g-tc g-fs-16 g-weight-5 g-c-0">
				中奖联系信息
			</div>
			<vcm-icon type="close" @click="handleCancel" />
		</div>
		<vcm-form
			ref="form"
			:model="formData"
			:rules="rules"
			inline
			:label-width="60"
			@submit.native.prevent
		>
			<template v-if="!$global.user.mobile">
				<vcm-form-item prop="mobile" label="手机号:">
					<vcm-input v-model="formData.mobile" placeholder="手机号" :maxlength="20" />
				</vcm-form-item>
				<vcm-form-item prop="verify_code" label="验证码:">
					<div class="g-flex">
						<vcm-input v-model="formData.verify_code" :maxlength="4" style="width:150px;flex:1" placeholder="验证码" />
						<span class="_send-btn g-tc" style="min-width:56px;flex:none" @click="handleSendCode">
							{{ codeWaitTime?codeWaitTime+'秒':'发送验证码' }}
						</span>
					</div>
				</vcm-form-item>
			</template>
			<vcm-form-item
				v-if="!$global.user.wechat && $config.open_collect_wx"
				prop="wechat"
				label="微信:"
			>
				<vcm-input v-model="formData.wechat" :maxlength="40" placeholder="用于后续的礼品发放" />
			</vcm-form-item>
			<vcm-form-item prop="user_name" label="姓名:">
				<vcm-input v-model="formData.user_name" :maxlength="20" placeholder="联系人姓名" class="g-flex-auto" />
			</vcm-form-item>
		</vcm-form>
		<div class="_green-btn g-m-16" @click="handleSave">
			确定
		</div>
	</vcm-modal>
</template>
<script>
import { Portal } from '@wya/vc';
import { RegEx } from '@utils/utils';

const com = {
	name: 'xls-template-modal',
	components: {
	},
	props: {
		activityId: {
			type: [Number, String],
			required: true
		}

	},
	data() {
		return {
			visible: false,
			formData: {
				activity_id: this.activityId,
				"mobile_prefix": "",
				"mobile": "",
				"verify_code": "",
				"wechat": "",
				"user_name": ""
			},
			rules: {
				mobile: [
					{ required: true, type: 'string', message: "请输入手机号码", trigger: "blur" },
					{ validator: RegEx.validator, type: 'mobile', message: '请输入正确的手机号', trigger: 'blur' }
				],
				verify_code: [
					{ required: true, type: 'string', message: "请输入验证码", trigger: "blur" }
				],
				wechat: [
					{ required: true, type: 'string', message: "请输入微信号", trigger: "blur" }
				],
				user_name: [
					{ required: true, type: 'string', message: "请输入姓名", trigger: "blur" }
				],
			},
			codeWaitTime: 0
		};
	},
	mounted() {
		this.visible = true;

	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSendCode() {
			if (this.codeWaitTime != 0) {
				this.$Toast.info(this.codeWaitTime + '秒后可再次发送');
				return;
			}
			this.$request({
				url: "_COMMON_SEND_CODE_POST",
				type: "POST",
				param: {
					  mobile: this.formData.mobile

				},
				loading: false,
			}).then(res => {
				this.codeWaitTime = 60;
				this.codeTimer = setInterval(() => {
					this.codeWaitTime--;
					if (this.codeWaitTime == 0) {
						clearInterval(this.codeTimer);
						this.codeTimer = undefined;
					}
				}, 1000);

			}).catch((res) => {
				console.error(res);
			});

		},
		handleSave() {
			return this.$refs.form.validate().then(valid => {
				return this.$request({
					url: "_COMMON_SAVE_USER_POST",
					type: "POST",
					param: this.formData,
					loading: false,
				}).then(res => {
					this.handleOk();
				}).catch((res) => {
					console.error(res);
				});
			}).catch((e) => console.error(e));
		},
	}
};
export default com;
export const UserInfo = new Portal(com, {});
</script>
<style lang="scss">
.v-activity-turntable-user-info {
	.vcm-modal__header {
		padding-top: 14px;
		padding-bottom: 14px;
	}
	.vcm-modal__content {
		padding: 0;
		._send-btn {
			display: inline-block;
			color: #108DE7;
			font-size: 14px;
		}
		._green-btn {
			height:48px;
			background:rgb(92,186,124);
			border-radius:5px;
			color: white;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		._gray-btn {
			height:48px;
			display: flex;
			justify-content: center;
			align-items: center;
			background:white;
			border: 1px solid #333;
			border-radius:5px;
			color: #333;
		}
	}
	.vcm-form-item {
		padding-left: 0 !important;
		.vcm-form-item__label {
			text-align: left;
		}
	}



}
</style>
