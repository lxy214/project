<template>
	<vcm-modal
		v-model="visible"
		title="填写收获地址"
		class="c-common-address"
		:mask-closable="false"
		:width="320"
		closable
		@cancel="handleCancel"
		@ok="handleSave"
	>
		<div slot="header" class="g-flex">
			<div class="g-pd-l-14 g-col g-tc g-fs-16 g-weight-5 g-c-0">
				填写收获地址
			</div>
			<vcm-icon type="close" @click="handleCancel" />
		</div>
		<vcm-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="0"
			@submit.native.prevent="handleSubmit"
		>
			<div class="g-flex" style="border:1px solid #e8e8e8;border-left:none;border-right:none">
				<div style="border-right:1px solid #e8e8e8">
					<vcm-form-item
						label=""
						prop="consignee"
					>
						<vcm-input
							v-model="formData.consignee"
							placeholder="收货人姓名"
							:maxlength="20"
						/>
					</vcm-form-item>
				</div>
				<vcm-form-item
					label=""
					prop="mobile"
				>
					<vcm-input
						v-model="formData.mobile"
						placeholder="联系电话"
						type="number"
						:maxlength="20"
					/>
				</vcm-form-item>
			</div>
			<div style="border-bottom:1px solid #e8e8e8">
				<vcm-form-item
					label="选择地区"
					prop="location"
					class="g-m-l-8 g-relative"
				>
					<div class="g-flex">
						<vcm-cascader
							v-model="formData.location"
							:data-source="region"
							:change-on-select="false"
							placeholder="选择地区"
							style="width:230px;"
							class="g-col"
						/>
						<vc-icon type="address" class="g-c-6 g-m-l-10 g-fs-18 " style="position: relative;top: 3px;" @click="handleGetLocation" />
					</div>
				</vcm-form-item>
			</div>
			<vcm-form-item
				label=""
				prop="address"
			>
				<vcm-textarea
					v-model="formData.address"
					placeholder="详情地址（如街道、小区、乡镇等）"
					:maxlength="200"
				/>
				<!-- <vcm-input
					v-model="formData.address"
					placeholder="详情地址（如街道、小区、乡镇等）"
				/> -->
			</vcm-form-item>
		</vcm-form>
		<template #footer>
			<div class=" g-center g-pd-tb-16 g-col">
				<span class="_green-btn g-center g-fs-16 g-c-white" @click="handleSave">确定</span>
			</div>
		</template>
	</vcm-modal>
</template>
<script>
import { Portal } from '@wya/vc';
import service from '@stores/services/common';
import { RegEx } from '@utils/utils';

const com = {
	name: 'xls-template-modal',
	components: {
	},
	mixins: [service.region()],
	props: {
		address: {
			type: Object,
			default: () => ({
				"consignee": "",
				// "mobile_prefix": "",
				"mobile": "",
				"province_code": "",
				"city_code": "",
				"area_code": "",
				"address": ""

			})
		},
		checkAddress: Function

	},
	data() {
		return {
			visible: false,
			formData: {
				consignee: this.address.consignee,
				mobile: this.address.mobile,
				// mobile_prefix:  this.address.mobile_prefix,
				address: this.address.address,
				location: [this.address.province_code, this.address.city_code, this.address.area_code].filter(Boolean)
			},
			rules: {
				consignee: [{ required: true, type: 'string', message: "请填写收货人姓名", trigger: "blur" }],
				mobile: [
					{ required: true, type: 'string', message: "请填写手机号", trigger: "blur" },
					{ validator: RegEx.validator, type: 'mobile', message: '请输入正确的手机号', trigger: 'blur' }
				],
				address: [{ required: true, type: 'string', message: "请填写详细地址", trigger: "blur" }],
				location: [{ required: true, type: 'array', message: "请选择地区", trigger: "blur" }]
			},
		};
	},
	mounted() {
		this.visible = true;

	},
	methods: {
		async handleOk() {
			const data = { ...this.formData };
			data.province_code = data.location[0];
			data.city_code = data.location[1];
			data.area_code = data.location[2];
			delete data.location;
			if (this.checkAddress) {
				const isOk = await this.checkAddress({ address_info: data });
				if (!isOk) return;
			}
			this.visible = false;
			this.$emit('sure', data);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {

			return this.$refs.form.validate().then(valid => {
				if (this.formData.location.filter(Boolean).length < 3) {
					this.$Toast.info("请选择完整地区");
					return;
				}
				this.handleOk();
				// return this.$request({
				// 	url: "",
				// 	type: "POST",
				// 	param: {},
				// 	loading: false,
				// }).then(res => {
				// 	this.handleOk();
				// }).catch((res) => {
				// 	console.error(res);
				// 	this.$Message.error(res.msg);
				// });
			}).catch((e) => console.error(e));
		},
		handleGetLocation() {
			this.$request({
				url: "_COMMON_LOCATION_GET",
				type: "GET",
				param: {},
				loading: false,
				location: true
			}).then(res2 => {
				this.formData.location = [
					res2.data.province.national_code,
					res2.data.city.national_code,
					res2.data.area.national_code
				];
			}).catch((res2) => {
				console.error(res);
			});
		}
	}
};
export default com;
export const Address = new Portal(com, {});
</script>
<style lang="scss">
.c-common-address {
	.vcm-modal__wrapper {
		z-index: 1000;
	}
	.vcm-modal__mask {
		z-index: 1000;
	}
	.vcm-modal__content {
		padding-left: 0;
		padding-right: 0;
		padding-bottom: 0px;
		.vcm-form-item {
			padding-left: 0px !important;

		}
		.vcm-form-item__wrapper:after {
			display: none;
		}

	}
	._green-btn {
		width:230px;
		height:48px;
		background:rgb(92,186,124);
		border-radius:5px;
	}
	.vcm-input__content input {
		font-size: 16px;
	}
	.vcm-list-item__extra {
		font-size: 16px;
	}
	.vcm-form-item__label {
		font-size: 16px;
	}
	.vcm-modal__title {
		font-weight: 400;
		font-size: 16px;
	}
	.vcm-modal__header {
		padding-top: 14px;
		padding-bottom: 14px;
	}


}
</style>
