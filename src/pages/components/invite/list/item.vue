<template>
	<div class="v-invite-list-item g-bg-white">
		<div class="g-flex g-flex-ac g-jc-sb g-pd-lr-12 g-pd-tb-15" @click="handleExpand('expend')">
			<div class="g-flex g-flex-ac">
				<vcm-icon
					:type="show ? 'down': 'right'"
					class="g-fs-14 g-c-999 g-m-r-5"
				/>
				<span class="g-fs-15 g-c-0">粉丝{{ getCodeName(it.it.floor) }}</span>
			</div>
			<div class="g-c-6">
				{{ it.it.count }}
			</div>
		</div>

		<vcm-expand ref="expand" v-model="show">
			<div
				v-for="(item,index) in list"
				:key="index"
				class="g-pd-lr-12 g-pd-tb-15"
			>
				<div class="g-flex g-pd-l-12 g-pd-tb-8">
					<img
						v-if="item.head_img_url"
						:src="item.head_img_url"
						class="_head"
					>

					<div class="g-flex g-jc-sb g-bb g-pd-r-12 g-pd-b-8 g-m-l-15" style="width: 100%;">
						<div class="g-flex g-fd-c g-col">
							<div class="g-flex-ac">
								<div class="g-fs-14 g-c-0">
									{{ item.nick_name }}
								</div>
								<div v-if="item.sex" class="g-m-l-5">
									<vcm-icon
										:type="item.sex == 1 ? 'm-nan' : 'm-nv'"
										:style="{
											color: +item.sex === 1 ? '#578FF2' : '#FF97B2'
										}"
									/>
								</div>
							</div>
							<div class="g-c-6">
								{{ item.province }}{{ item.city }}
							</div>
							<div class="g-c-6 g-oneline">
								{{ item.activity_name }}
							</div>
						</div>

						<div class="g-flex g-flex-ac g-col">
							<div class="g-m-r-10" style="min-width: 120px;">
								<div>
									<span class="g-fs-14 g-c-0">
										{{ item.user_name }}
									</span>
									<span class="g-tc g-c-white _lable">
										{{ ['会员','分享商','代理'][item.max_role - 2] }}
									</span>
								</div>
								<div
									v-if="item.mobile"
									class="g-flex g-flex-ac g-c-0"
								>
									<div
										class="g-flex-cc g-m-r-5"
										style="padding: 2px; background: #578FF2; border-radius:2px;"
									>
										<vcm-icon type="m-phone" class="g-fs-12 g-c-white" />
									</div>
									<a :href="`tel:${item.mobile}`">{{ item.mobile }}</a>
								</div>
								<div v-if="item.wechat" class="g-flex g-col">
									<div
										class="g-flex-cc g-m-r-5"
										style="padding: 2px; background: #83c663; border-radius:2px;"
									>
										<vcm-icon type="wechat" class="g-fs-12 g-c-white" />
									</div>
									<span class="g-m-r-5 g-oneline g-col" style="word-break: break-all;">
										{{ item.wechat }}
									</span>
									<vc-clipboard
										:value="item.wechat"
										tag="span"
										style="color:#108DE7"
										@after="() => MToast.info('复制成功', 2)"
									>
										复制
									</vc-clipboard>
								</div>
							</div>

							<vcm-icon
								:type="collectList.includes(item.user_id) ? 'm-collected' : 'm-collect'"
								:style="{
									color: collectList.includes(item.user_id) ? '#FEBB2B !important' : '#cdcdcd'
								}"
								class="g-fs-16"
								@click="handleCollect(item.user_id)"
							/>
						</div>
					</div>
				</div>
			</div>
		</vcm-expand>
	</div>
</template>

<script>
import { letterMap } from "@constants/constants";
import { MToast } from '@wya/vc';
import { URL } from '@utils/utils';

export default {
	name: "xls-item",
	model: {
		prop: 'expandIds',
		event: 'change'
	},
	props: {
		it: Object,
		collectList: {
			type: Array
		},
		expandIds: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
			MToast,
			show: false,
			list: []
		};
	},
	watch: {
		expandIds: {
			immediate: true,
			handler(v) {
				if (v && v.length && v.includes(this.it.it.floor)) {
					this.show = true;
					this.getList();
				} else {
					this.show = false;
				}
			}
		}
	},
	mounted() {
		let { query = {} } = URL.parse(); // this.$route需要设置scroll.sync
	},
	methods: {
		handleExpand() {
			if (this.show) {
				let index = this.expandIds.findIndex(v => v === this.it.it.floor);
				let arr = [...this.expandIds];
				arr.splice(index, 1);
				this.$emit('change', arr);
			} else {
				this.$emit('change', [this.it.it.floor].concat(this.expandIds));
			}

		},
		getList() {
			let {
				activity_id,
				activityId,
				...rest
			} = this.$route.query;
			this.$request({
				url: "_INVITE_USER_RELATION_DETAIL_GET",
				type: "GET",
				param: {
					...rest,
					activity_id: activityId,
					floor: this.it.it.floor,
				},
				loading: false
			}).then(res => {
				this.list = res.data;
			}).catch((res) => {
				MToast.info(res.msg, 1);
			});
		},
		handleInit() {
			this.$store.commit('INVITE_LIST_INIT');
		},
		getCodeName(num) {
			const sameTime = parseInt(num / 26, 10) + 1;
			const c = letterMap[(num % 26) + 64];
			let result = '';

			for (let i = 0; i < sameTime; i++) {
				result += c;
			}

			return result;
		},
		handleAfter() {},
		handleCollect(user_id) {
			this.$request({
				url: "_INVITE_USER_COLLECT_POST",
				type: "POST",
				param: {
					user_id,
					is_collect: this.collectList.includes(user_id) ? 0 : 1
				},
				loading: false,
				successTip: false
			}).then(res => {
				this.$emit('collect');
			}).catch((res) => {
				MToast.info(res.msg, 1);
			});
		}
	}
};
</script>

<style lang="scss">
.v-invite-list-item {
	._head {
		width: 36px;
		height: 36px;
		border-radius: 50%;
	}

	._lable {
		padding: 2px 7px;
		background: #625277;
		border-radius:4px;
	}

	._icon {
		padding: 2px 4px;
		background: #578FF2;
		border-radius:4px;
		margin-right: 3px;
	}
}
</style>
