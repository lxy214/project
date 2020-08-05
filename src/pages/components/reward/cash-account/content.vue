<template>
	<div class="v-reward-cash-account">
		<div class="g-center _header">
			<div 
				class="__play" 
				style="background: #25ABEE;margin-right: 70px;"
				:style="{opacity:formData.account_type==2?1:0.2}"
				@click="formData.account_type = 2"
			>
				<vcm-icon type="alipay" class="g-fs-30 g-c-white" />
			</div>
			<div 
				class="__play" 
				style="background: #E50112;"
				:style="{opacity:formData.account_type==3?1:0.2}"
				@click="formData.account_type = 3"
			>
				<vcm-icon type="m-bank-card" class="g-fs-30 g-c-white" />
			</div>
		</div>
		<div class="g-bg-white g-pd-lr-12 _content">
			<div class="g-bb g-pd-t-15">
				<span class="g-fs-14 g-c-0">真实姓名</span>
				<vcm-input 
					v-model="formData.account_name" 
					placeholder="请输入您的姓名"
					class="g-m-t-20 g-m-b-8"
					:maxlength="10"
				/>
			</div>
			<div v-if="formData.account_type == 2" class="g-bb g-pd-t-15">
				<span class="g-fs-14 g-c-0">支付宝账户</span>
				<vcm-input
					v-model="formData.account"
					placeholder="请输入您的支付宝账号"
					:maxlength="40"
					class="g-m-t-20 g-m-b-8"
					@change="handleAccountChange"
				/>
			</div>
			<template v-if="formData.account_type == 3">
				<div class="g-bb g-pd-t-15">
					<span class="g-fs-14 g-c-0">银行卡号</span>
					<vcm-input
						v-model="formData.account"
						:maxlength="40"
						placeholder="请输入您的银行卡号"
						class="g-m-t-20 g-m-b-8"
						@change="handleAccountChange"
					/>
				</div>
				<div class="g-bb g-pd-t-15">
					<span class="g-fs-14 g-c-0">所属银行</span>
					<div class="g-flex g-jc-sb g-flex-ac g-m-t-20 g-pd-b-8" @click="handleSelectBank">
						<span v-if="curBank" class="g-c-0 g-fs-16">{{ curBank.account_name }}</span>
						<span v-else class="g-c-9 g-fs-16">请选择银行</span>
						<vcm-icon type="right" class="g-fs-14 g-c-9" />
					</div>
				</div>
				<div class="g-bb g-pd-t-15">
					<span class="g-fs-14 g-c-0">开户支行</span>
					<vcm-input v-model="formData.bank_outlet" :maxlength="40" placeholder="选填" class="g-m-t-20 g-m-b-8" />
				</div>
			</template>
		</div>
		<div class="g-center g-fd-c g-m-tb-30">
			<div 
				class="g-tc g-c-white _footer g-fs-16 _green-btn " 
				:class="{'_light-btn':lightBtn}"
				@click="handleSave"
			>
				保存
			</div>
			<div 
				v-if="$route.query.account" 
				class="g-tc g-m-t-16 g-bg-white _footer g-fs-16" 
				style="border: 1px solid #CDCDCD;"
				@click="handleDelete"
			>
				删除
			</div>
		</div>
	</div>
</template>

<script>
import { MPicker, MToast } from '@wya/vc';
import { setData } from	'@utils/utils';

export default {
	name: 'xls-content',
	data() {
		return {
			formData: {
				"account_id": '', // 用户账户ID，编辑用户提现账户时必传，新增不传
				// "type_id": undefined, // 类型：1微信零钱包 2支付宝 3中国银行 4工商银行 5农业银行 6招商银行 7建设银行 8邮政储蓄银行
				"account_type": 2, // 账户类型  2 线下-支付宝， 3 线下-银行卡
				"account_name": "", // 真实姓名
				"account": "", // 账号或卡号
				// "bank": "", // 银行名称
				system_account_id: 0, // 银行id
				"bank_outlet": "", // 支行
			},
			bankList: [],
			aliPay: undefined
		};
	},
	computed: {
		curBank() {
			return this.bankList.find(bank => bank.account_id == this.formData.system_account_id);
		},
		lightBtn() {
			if (this.formData.account_type == 2) {
				return !(this.formData.account_name && this.formData.account);

			} else {
				return !(this.formData.account_name && this.formData.account && this.curBank);
			}
		}


	},
	created() {
		this.loadSupportData();
	},
	mounted() {
		let account = this.$route.query.account && JSON.parse(this.$route.query.account);
		if (account) {
			setData(this.formData, account);
	
		}
	},
	methods: {
		handleAccountChange() {
			this.$nextTick(() => {
				this.formData.account = this.formData.account.replace(/\s/g, '');
			});
		},
		loadSupportData() {
			return this.$request({
				url: "_REWARD_CASH_ACCOUNT_SUPPORT_BANK_GET",
				type: "GET",
				loading: false,
			}).then(res => {
				this.bankList = res.data.filter(i => i.type_id != 1 && i.type_id != 2)
					.map(i => ({ ...i, label: i.account_name, value: i.account_id, }));
				this.aliPay = res.data.find(i => i.type_id == 2);
			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		handleSelectBank() {
			MPicker.open({
				value: [this.formData.system_account_id],
				dataSource: [this.bankList],
				cols: 1,
				title: '所属银行',
				onOk: (value, label) => {
					this.formData.system_account_id = value[0];
				}
			});
		},
		handleSave() {
			if (!this.formData.account_name) {
				MToast.info('请输入您的姓名', 1);
				return;
			}

			if (!this.formData.account) {
				MToast.info(this.formData.account_type === 2 ? '请输入您的支付宝账号' : '请输入您的银行卡号', 1);
				return;
			}
			if (this.formData.account_type === 3 && !this.curBank) {
				MToast.info('请选择所属银行', 1);
				return;
			}
			const param = {
				...this.formData,
			};
			if (param.account_type == 3) {
				param.bank = this.curBank.account_name;
				param.type_id = this.curBank.type_id;
			} else {
				if (!this.aliPay) return this.$Toast.info('暂不支持支付宝');
				param.bank = this.aliPay.account_name; // 如果是支付宝特殊处理
				param.type_id = this.aliPay.type_id;
				param.system_account_id = this.aliPay.account_id;
			}
			this.$request({
				url: "_REWARD_CASH_ACCOUNT_SAVE_ACCOUNT_POST",
				type: "POST",
				param,
				loading: false,
				successTip: false
			}).then(res => {
				MToast.info(res.msg, 1, () => {
					this.$router.go(-1);
				});
			}).catch((res) => {
				console.error(res);
				MToast.info(res.msg, 1);
			});
		},
		handleDelete() {
			this.$request({
				url: "_REWARD_CASH_ACCOUNT_DELETE_ACCOUNT_POST",
				type: "POST",
				param: {
					account_id: this.formData.account_id
				},
				loading: false,
				successTip: false

			}).then(res => {
				this.$Toast.info(res.msg, 1, () => {
					this.$router.go(-1);
				});
				
			}).catch((res) => {
				console.error(res);
				MToast.info(res.msg, 1);
			});
		}
	}
};
</script>

<style lang="scss">
.v-reward-cash-account {
	._header {
		height: 100px;

		.__play {
			width: 46px;
			height: 46px;
			line-height: 46px;
			text-align: center;
			border-radius:50%;
		}
	}

	._content {
		padding-bottom: 22px;
		
		.vcm-input__content {
			input {
				padding: 0px;
			}
		}
	}

	._footer {
		width:80%;
		height:48px;
		line-height: 48px;
		border-radius:5px;
	}
	._green-btn {
		background: #5CBA7C;
		&._light-btn {
			background: rgba(92, 186, 124,0.2);

		}

	}
}
</style>
