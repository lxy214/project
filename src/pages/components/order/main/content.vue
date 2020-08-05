<template>
	<div class="v-order-main g-flex g-fd-c">
		<vcm-form
			ref="form"
			style="height:100%;display: flex;flex-direction: column;"
			:model="formData"
			:rules="rules"
			@submit.native.prevent
		>
			<div class="g-col" style="overflow:auto">
				<div class="g-row-group g-c-0 g-jc-c g-ai-c g-flex g-pd-8">
					<img :src="invite_user.head_img_url" alt="" class="g-imgr-36 g-m-r-12">
					<span class="g-fs-16 ">{{ invite_user.nick_name }}</span> <span class="g-fs-12">（推荐你购买）</span>
				</div>
				<div class="g-row-group g-pd-t-12">
					<div class="g-row-item" style="padding:0">
						<div class="g-bg-f8 g-pd-12 g-flex">
							<img :src="product.image_url+'!2-2'" style="max-width:78px;max-height:78px;" class="g-m-r-8">
							<div class="g-col">
								<div class="g-c-0 g-fs-15 g-twoline">
									{{ product.product_name }}
								</div>
								<template v-if="product.sku_info">
									<div
										v-for="(sku ,index) in product.sku_info"
										:key="index"
										style="background:white"
										class="g-dp-ib g-m-tb-8 g-m-r-8"
									>
										<span class="g-pd-6 g-c-9 g-br-4">{{ sku.spec_value_name }}</span>
									</div>
								</template>
								<div class="g-flex g-jc-sb g-fs-14">
									<div class="g-col ">
										<span class=" _red g-m-r-8">¥{{ product.activity_price }}</span>
										<span class="g-c-9 g-td-lt">¥{{ product.price }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="g-row-item g-flex g-jc-sb">
						<span class="g-fs-14 g-c-0">
							数量
						</span>
						<dxb-number-add
							v-model="formData.quantity"
							:min="1"
							:max="maxQuantity"
							@change="handleReloadOrder"
							@over-max="$Toast.info('最多购买'+formData.quantity+'件哦～')"
							@lower-min="$Toast.info('不能再少了哦～')"
						/>
					</div>
					<div class="g-row-item g-flex g-jc-sb g-fs-14 g-c-0">
						<span>
							运费
						</span>
						<span>
							{{ amount.freight_amount=='0.00'?'包邮':amount.freight_amount }}

						</span>
					</div>
				</div>
				<div class="g-row-group g-pd-12 g-flex g-ai-c" @click="handleChangeAddress">
					<vc-icon type="address" class="g-c-6 g-m-r-10 g-fs-18" />
					<div class="g-col g-fs-14">
						<div class="g-c-3">
							收货人：{{ formData.address_info.consignee }} {{ formData.address_info.mobile }}
						</div>
						<div class="g-c-3">
							收货地址： {{ locationStr }} {{ formData.address_info.address }}
						</div>
					</div>
					<vc-icon type="right" class="g-c-9" />
				</div>
				<div class="g-row-group g-pd-12 g-flex g-jc-sb">
					<span><vc-icon type="m-wechat-pay" class="_green g-m-r-10 g-fs-18" /> <span class="g-c-0 g-fs-14">微信支付</span></span>
					<vc-icon type="m-select" class="g-c-9 g-relative" style="top:4px" />
				</div>

				<div v-if="!$global.user.mobile" class="g-row-group">
					<vcm-form-item
						label=""
						prop="mobile"
					>
						<vcm-input v-model="formData.mobile" placeholder="用户手机号" :maxlength="20" />
					</vcm-form-item>
					<vcm-form-item
						label=""
						prop="verify_code"
					>
						<div class="g-flex">
							<vcm-input
								v-model="formData.verify_code"
								class="g-flex-auto"
								style="width:150px;flex:1"
								:maxlength="4"
								placeholder="验证码"
							/>
							<span class="_send-btn g-flex-none g-pd-6 g-tc" style="min-width:76px" @click="handleSendCode">
								{{ codeWaitTime?codeWaitTime+'秒':'发送验证码' }}
							</span>
						</div>
					</vcm-form-item>
				</div>
				<div class="g-bg-white g-row-group">
					<vcm-form-item
						v-if="!$global.user.wechat && $config.open_collect_wx"
						label=""
						prop="wechat"
					>
						<div class="g-c-0 g-fs-14">
							<span>
								<vc-icon type="wechat" class="_green g-m-r-10 g-fs-18" />
								<span class="g-c-0 g-fs-14 g-m-r-10">微信号</span>
								<vcm-input
									v-model="formData.wechat"
									placeholder="用于后续的礼品发放"
									class="g-fs-14"
									style="width:200px"
									:maxlength="40"
								/>
							</span>
						</div>
					</vcm-form-item>
				</div>
			</div>
			<div class="g-flex g-bg-white" style="height:48px">
				<div class="g-col g-tr g-m-r-18 g-flex g-fd-c g-jc-c ">
					<div class="g-fs-15">
						<span class="g-c-0 g-weight-5">合计：</span><span class="_red">¥{{ amount.orders_amount }}</span>
					</div>
					<div class="g-c-6 g-m-r-8">
						共{{ formData.quantity }}件
					</div>
				</div>
				<div class="g-center g-c-white g-fs-16" style="width:120px;height:48px;background:rgba(38,190,118,1);" @click="handelSubmit">
					提交订单
				</div>
			</div>
		</vcm-form>
	</div>
</template>

<script>
import { debounce } from 'lodash';
import { Storage, requestWXPay, treeForEach, RegEx } from '@utils/utils';
import { OSS } from '@constants/constants';
import { MToast } from '@wya/vc';
import { refreshUserInfo } from '@routers/hooks';
import NumberAdd from '@common/number-add/number-add';
import service from '@stores/services/common';
import { Address } from '@common/address/address';

export default {
	name: 'xls-tpl',
	components: {
		'dxb-number-add': NumberAdd
	},
	mixins: [service.region()],
	data() {
		const sessionData = Storage.get(this.$route.query.session, { session: true });
		if (!this.$global.user.mobile && !sessionData.formData.mobile && sessionData.formData.address_info.mobile) {
			sessionData.formData.mobile = sessionData.formData.address_info.mobile;
		}
		return {
			img: OSS.ICON_O1,
			input: "",
			num: 1,
			session: this.$route.query.session,
			sessionData,
			orderInfo: {
				amount: {},
				product: {},
				invite_user: {},
				activity_buy_surplus_num: {}
			},
			codeWaitTime: 0,
			rules: {
				mobile: [
					{ required: true, type: 'string', message: "请输入手机号码", trigger: "blur" },
					{ validator: RegEx.validator, type: 'mobile', message: '请输入正确的手机号', trigger: 'blur' }
				],
				wechat: [
					{ required: true, type: 'string', message: "请输入微信号", trigger: "blur" },
					{ validator: RegEx.validator, type: 'weChat', message: '请输入正确的微信号', trigger: 'blur' }
				],
				verify_code: [
					{ required: true, type: 'string', message: "请输入验证码", trigger: "blur" }
					// { validator: RegEx.validator, type: 'wechat', message: '请输入正确的微信号', trigger: 'blur' }
				]

			},
			loading: false
		};
	},
	computed: {
		maxQuantity() {
			const stock = this.orderInfo.product.stock || 0;
			const limit = this.orderInfo.activity_buy_surplus_num.buy_num_limit || 0;
			if (limit.is_limit == 2) {
				return Math.min(limit.surplus_num, stock);
			} else {
				return stock;
			}

		},
		formData() {
			return this.sessionData.formData;
		},
		product() {
			return this.orderInfo.product;
		},
		amount() {
			return this.orderInfo.amount;
		},
		invite_user() {
			return this.orderInfo.invite_user;

		},
		locationStr() {
			const { province_code, city_code, area_code } = this.sessionData.formData.address_info;
			let provinceName;
			let cityName;
			let areaName;
			treeForEach(this.region, (node) => {
				if (node.value === province_code) {
					provinceName = node.label;
				} else if (node.value === city_code) {
					cityName = node.label;
				} else if (node.value === area_code) {
					areaName = node.label;
				}
			});
			return provinceName + ' ' + cityName + ' ' + areaName;
		}
	},
	created() {
		this.loadOrderConfirmInfo();
	},

	methods: {
		async handelSubmit() {
			if (this.loading) return;
			this.loading = true;
			try {
				await this.$refs.form.validate().then(() => 1);
			} catch (e) {
				return this.loading = false;
			}

			try {
				await this.setUserInfo();
			} catch (e) {
				return this.loading = false;
			}

			let result;
			try {
				result = await this.$request({
					url: "_ORDER_MAIN_SUBMIT_POST",
					type: "POST",
					param: {
						...this.sessionData.formData
					},
					loading: true,
					successTip: false
				});
			} catch (e) {
				return this.loading = false;
			}

			if (result.data.err_code == 1001) {
				this.$Toast.info(result.data.err_msg);
				// TODO: 可以尝试刷新数据
				return this.loading = false;
			}

			Storage.set(this.session, this.sessionData);

			let onError = (err) => {
				console.log(err);
				this.cancelOrder(result.data.orders_id);
				return this.loading = false;
			};

			try {
				let res = await this.$request({
					url: "_COMMON_WECHAT_PAY_POST",
					type: "POST",
					param: {
						orders_id: result.data.orders_id
					},
					useXHR: true,
					loading: true,
					successTip: false
				});

				const options = res.data.wechatPayJs;
				options.timestamp = options.timeStamp;
				delete options.timeStamp;

				window.app.$wx.chooseWXPay({
					...options,
					success: async ({ errMsg }) => {
					  // 支付成功后的回调函数
						if (errMsg === 'chooseWXPay:ok') {
							if (
								!this.$global.user.mobile
								|| (this.$config.open_collect_wx && !this.$global.user.wechat)
							) {
								// 重写刷新用户信息，原则上直接使用Global.updateUser()就行; 设计缺陷吧
								await refreshUserInfo();
							}
							this.$router.push({
								path: '/order-result',
								query: { ...this.$route.query, orders_id: result.data.orders_id }
							});
						} else {
							onError();
						}
					},
					fail: onError,
					cancel: onError
				  });
			} catch (e) {
				onError();
			}
		},
		async setUserInfo() {
			let {
				mobile,
				verify_code,
				wechat
			} = this.sessionData.formData;
			return this.$request({
				url: '_COMMON_SAVE_USER_POST',
				type: 'POST',
				param: {
					mobile,
					verify_code,
					wechat,
					user_name: this.sessionData.formData.address_info.consignee
				}
			});
		},
		handleReloadOrder: debounce(function () {
			this.$request({
				url: "ORDER_MAIN_GET",
				type: "POST",
				param: {
					...this.sessionData.formData,

				},
				loading: false,
			}).then(res => {
				this.orderInfo = res.data;

			}).catch((res) => {
				console.error(res);
			});
		}, 200),
		async loadOrderConfirmInfo() {
			await refreshUserInfo();
			this.$request({
				url: "ORDER_MAIN_GET",
				type: "POST",
				param: {
					...this.sessionData.formData,
				},
				loading: false,
			}).then(res => {
				this.orderInfo = res.data;
			}).catch((res) => {
				console.error(res);
			});

		},
		handleSendCode() {
			if (this.codeWaitTime != 0) {
				this.$Toast.info(this.codeWaitTime + '秒后可再次发送');
				return;
			}
			if (!RegEx.mobile.test(this.formData.mobile)) {
				this.$Toast.info('手机号格式不正确');
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
		async handleChangeAddress() {

			const addressData = await Address.popup({
				address: this.sessionData.formData.address_info,
				checkAddress: address => this.checkProvince(address.address_info.province_code)
			});
			if (!addressData) return;
			this.sessionData.formData.address_info = addressData;
			Storage.set(this.session, this.sessionData, { session: true });

			this.handleReloadOrder();
		},
		cancelOrder(orders_id) {
			orders_id && this.$request({
				url: "_ORDER_CANCEL_POST",
				type: "POST",
				param: {
					orders_id
				},
				loading: false,
				successTip: false,
				errorTip: false
			}).catch((res2) => {
				console.error(res2);
			});
		},
		checkProvince(provinceCode) {
			let isSupport = this.sessionData.activityData.area_data.includes(provinceCode) || this.sessionData.activityData.product_type == 2;
			if (!isSupport) {
				this.$Toast.info('该地区不支持配送');
			}
			return isSupport;

		}
	},
};
</script>

<style lang="scss">
.v-order-main {
	._red {
		color: #FF3C4A
	}
	._green {
		color: #26BE76
	}
	._send-btn {
		display: inline-block;
		color: #FF3C4A;
		border:1px solid rgba(255,60,74,1);
		border-radius:4px;
		font-size: 14px;
		line-height: 14px;
	}
	.vcm-input__input {
		font-size: 14px;
	}
}
</style>
