<template>
	<div class="v-product-main g-scroll-container">
		<dxb-empty v-if="errorTip" :tips="errorTip.tip" :img="errorTip.img" />
		<template v-else>
			<template v-for="(item) in decorateList">
				<components
					:is="`xls-${item.module}`"
					v-if="regex.test(item.module)"
					:key="item.id"
					v-bind="item"
					@decorate-click="handleBuy"
				/>
			</template>
		</template>
		<dxb-fix-qrcode
			v-show="status === 1"
			ref="qrcode"
			@loaded-code="checkToOrderResult"
		/>
	</div>
</template>

<script>
import { createSession, Storage, findNodeByLabel, URL } from '@utils/utils';
import { OSS } from '@constants/constants';
import { Address } from '@common/address/address';
import { MPicker } from '@wya/vc';
import service from '@stores/services/common';
import Empty from '@common/empty';
import { debounce } from 'lodash';
import QrCode from '@common/qrcode/qrcode';
import modulesMixin from '../common/modules';
import { SelectSku } from '../common/popup/select-sku';
import { USER_KEY } from '../../../constants/constants';


export default {
	name: 'xls-tpl',
	components: {
		'dxb-empty': Empty,
		'dxb-fix-qrcode': QrCode
	},
	mixins: [modulesMixin, service.region()],
	data() {
		return {
			query: {},
			activity: {},
			sku: [],
			skuNum: 0,
			session: '',
			sessionData: {},
			isDecorate: true, // 用于xls.config.js
			decorateList: [],
			status: undefined,
		};
	},
	computed: {
		errorTip() {
			const codeMap = {
				'-1001': {
					tip: '对不起，你当前没有操作权限',
					img: 'M_24'
				},
				'-1002': {
					tip: '对不起，来晚了，活动已结束啦~',
					img: 'M_39'
				},
				'-1003': {
					tip: '只有他人邀请您，才可参与本活动哦~',
					img: 'M_32'
				}
			};
			return codeMap[this.status];
		}

	},
	created() {
		let { activity_id, invite_user_id } = this.$route.query;
		const session = createSession(this.$route.query.session);

		// 从公众号过来是不带invite_user_id的，此时用inviter_id作为invite_user_id, 同步global和storage
		// if (!invite_user_id) {
		// 	invite_user_id = this.$global.user.inviter_id;
		// 	this.$global.updateUser({ invite_user_id });
		// }
		const sessionData = Storage.get(session, { session: true }) || {
			sku: [],
			activityData: {},
			addressData: {},
			codeData: {},
			formData: {
				activity_id: +activity_id,
				"activity_type": '',
				"activity_tool_type": '',
				"product_id": '',
				"product_sn": "",
				"sku_sn": "",
				"quantity": 1,
				"invite_user_id": invite_user_id,
				"address_info": {
					"consignee": "",
					"mobile_prefix": "",
					"mobile": "",
					"province_code": "",
					"city_code": "",
					"area_code": "",
					"address": ""
				},
				"mobile": "",
				"verify_code": "",
				"wechat": ""
			}
		};

		this.query = { ...this.$route.query, invite_user_id };
		this.session = session;
		this.sessionData = sessionData;

		this.loadActivity(this.query.activity_id);
	},
	methods: {
		handleBuy: debounce(async function () {
			if (!this.activity.is_begin) {
				this.$Toast.info(`活动将于${this.activity.start_time}开始`);
				return;
			}
			// is_limit 1是不限制，2是限制
			if (this.activity.buy_times_limit.is_limit == 2) {
				if (this.activity.buy_times_limit.surplus_times <= 0) {
					return this.$Toast.info('参与活动次数达到上限');
				}
			}
			try {
				await this.loadSku();
				const skuData = await SelectSku.popup({
					sku: this.sku,
					skuSn: this.sessionData.formData.sku_sn,
					skuNum: this.skuNum,
					quantity: this.sessionData.formData.quantity,
					productName: this.activity.product_name,
					limitNum: this.activity.buy_num_limit.is_limit == 2 ? +this.activity.buy_num_limit.surplus_num : -1
				});

				this.sessionData.formData.sku_sn = skuData.sku_sn;
				this.sessionData.formData.quantity = skuData.quantity;
				Storage.set(this.session, this.sessionData, { session: true });
				await this.checkCanBuy();

				let wxAddressData;
				try {
					wxAddressData = await this.openAddress(); // 微信地址错误时，用Address
					await this.checkOrderInfo({ address_info: wxAddressData });
				} catch (e) {
					console.log('地址错误，重新选择地址');
					wxAddressData = await Address.popup({
						address: wxAddressData,
						checkAddress: (address) => this.checkOrderInfo(address)
					});
				}

				this.sessionData.formData.address_info = wxAddressData;
				Storage.set(this.session, this.sessionData, { session: true });
				this.$router.push({ path: '/order-main', query: { ...this.$route.query, session: this.session } });
			} catch (e) {
				console.log(e);
			}
		}, 200),
		loadActivity() {
			this.$request({
				url: "_ACTIVITY_FISSION_GET",
				type: "GET",
				param: {
					activity_id: this.query.activity_id
				},
				loading: false,
			}).then(res => {
				this.status = 1;
				res.data.activity_name && (document.title = res.data.activity_name);
				this.decorateList = res.data.decorate_content;
				this.decorateList.forEach(v => {
					v.show = 1;
					if (v.list && v.list.length) {
						v.list.forEach(e => e.show = 1);
					}
				});
				this.activity = res.data;
				this.sessionData.activityData = res.data;
				const { product_id, activity_type, activity_tool_type, product_sn } = res.data;
				this.sessionData.formData = { ...this.sessionData.formData, product_id, activity_type, activity_tool_type, product_sn };

				this.emitWxShare(res.data);
			}).catch((res) => {
				if (res.status !== 0) {
					this.status = res.status;
					return;
				}
			});
		},
		loadSku() {
			return this.$request({
				url: "_PRODUCT_MAIN_SKU_GET",
				type: "GET",
				param: {
					activity_id: this.query.activity_id
				},
				loading: false,
			}).then(res => {
				this.sku = res.data.product_sku;
				this.sessionData.skuData = this.sku;
				this.skuNum = res.data.sku_num;
				return res.data;

			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		async openAddress() {
			if (this.sessionData.formData.address_info.mobile) {
				return this.sessionData.formData.address_info;
			}
			const addressInfo = await this.loadHistoryAddress();
			if (addressInfo) {
				return addressInfo;
			}
			return new Promise((resolve, reject) => {
				this.$wx.openAddress({
					success: (res) => {
						resolve({
							consignee: res.userName,
							mobile: res.telNumber,
							address: res.detailInfo,
							...this.parseWxAddress(res),
						});
					},
					fail: (e) => {
						this.$Toast.info('微信地址获取失败');
						reject(e);
					},
				});
			});
		},
		parseWxAddress(res) {
			let {
				provinceName,
				cityName,
				countryName
			} = res;
			let province_code;
			let city_code;
			let area_code;
			let el = this.region.find(item => {
				province_code = item.value;
				return provinceName === item.label && item.children && item.children.find(it => {
					city_code = it.value;
					return cityName === it.label && it.children && it.children.find(i => {
						area_code = i.value;
						return countryName === i.label;
					});
				});
			});
			return el ? { province_code, city_code, area_code } : { province_code: '', city_code: '', area_code: '' };
		},
		loadHistoryAddress() {
			return this.$request({
				url: "_PRODUCT_MAIN_HISTORY_ADDRESS_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				if (res.data.is_history_address) {
					return res.data.address_info;
				}
			}).catch((res) => {
				console.error(res);
			});

		},
		checkCanBuy() {
			return this.$request({
				url: "_PRODUCT_MAIN_CAN_BUY_GET",
				type: "POST",
				param: {
					...this.sessionData.formData
				},
				loading: false,
			});
		},
		checkOrderInfo(address = {}, errorTip = true) {
			const provinceCode = address.address_info.province_code;
			const isSupport = this.activity.area_data.includes(provinceCode) || this.activity.product_type == 2;
			if (!isSupport) {
				errorTip && this.$Toast.info('该地区不支持配送');
				return Promise.reject();
			}

			return this.$request({
				url: "ORDER_MAIN_GET",
				type: "POST",
				param: {
					...this.sessionData.formData,
					...address
				},
				loading: false,
				errorTip
			});
		},
		async checkToOrderResult(codeData) {
			this.codeData = codeData;
			const latestOrder = await this.loadLatestOrder();
			if (!this.codeData || !latestOrder) return console.log('codeData, latestOrder');

			const remainNum = await this.getRemainLottery();
			if (remainNum) {
				this.$router.push({
					path: '/order-result',
					query: {
						...this.query,
						orders_id: latestOrder.orders_id,
					}
				});
				return;
			}
			if (this.codeData.drainage_type == 1) { // 如果是公众号
				if (this.$global.user.subscribe) return; // 如果已经关注
				this.$router.push({
					path: '/order-result',
					query: {
						...this.query,
						orders_id: latestOrder.orders_id,
					}
				});
			} else if (this.codeData.drainage_type == 2 || this.codeData.drainage_type == 3) { // 否则如果是社群/个人
				if (this.codeData.is_join && this.codeData.subscribe) return; // 如果已经长按过二维码
				if (this.codeData.max_role == 4 && this.codeData.status == 1 && this.codeData.subscribe) { // 如果是非黑白名单的代理，并且已经关注公众号
					return;
				}
				this.$router.push({
					path: '/order-result',
					query: {
						...this.query,
						orders_id: latestOrder.orders_id,
					}
				});
				return;
			}
		},
		// 获取最近一次已支付的订单
		loadLatestOrder() {
			return this.$request({
				url: "_ORDER_GET_NEW_PAY_ORDER_GET",
				type: "GET",
				param: {
					activity_id: this.query.activity_id
				},
				loading: false,
				errorTip: false
			}).then(res => {
				return res.data;
			}).catch((res) => {
				console.error(res);
			});
		},
		getRemainLottery() {
			return this.$request({
				url: "_PRODUCT_MAIN_REMAIN_LOTTRY_NUM",
				type: "GET",
				param: {
					activity_id: this.query.activity_id
				},
				loading: false,
			}).then(res => {
				return res.data.remainLotteryNum;
			}).catch((res) => {
				console.error(res);
			});
		},

		/**
		 * 分享逻辑
		 */
		emitWxShare(data) {
			const { share } = data;
			// 分享逻辑
			if (!share) return;

			const { activity_id } = this.$route.query;
			const { activity_tool_type, activity_name, product_name } = data;
			const { share_icon, icon_image, share_content, content } = share;
			const { invite_user_id, admin_id } = this.$global;
			const { user } = this.$global;

			let base = this.$router.options.base;
			base.pop();

			const link = URL.merge({
				path: base.join('/') + this.$route.path,
				query: {
					admin_id,
					invite_user_id,
					activity_id,
					activity_tool_type
				}
			});

			this.$wx.share({
				title: activity_name,
				desc: content || `我抢到了【${product_name}】, 还有机会，快来抢哦~`,
				link: window.location.origin + link,
				imgUrl: icon_image || OSS.M_12
			});
		}
	},
};
</script>

<style lang="scss">
.v-product-main {
}
</style>
