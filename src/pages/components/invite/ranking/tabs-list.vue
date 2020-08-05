<template>
	<div v-if="loadedAuth" class="v-invite-ranking g-bg-white">
		<dxb-empty v-if="errorTip" :tips="errorTip.tip" :img="errorTip.img" />
		<template v-else>
			<vcm-tabs
				:value="type"
				:animated="false"
				:class="{
					'_tab-hide': !isRootUser
				}"
				@click="handleChange"
			>
				<vcm-tabs-pane
					v-for="(item) in tabs"
					:key="item.value"
					:label="item.label"
					:name="item.value"
				>
					<div class="g-relative g-m-b-32" style="z-index: 9;">
						<div class="_top-wrap g-relative g-flex">
							<vcm-img
								:src="OSS['M_61']"
								class="g-absolute"
								style="z-index: -2; top: -72px;"
							/>
							<div v-if="first" class="_top">
								<div class="g-relative g-flex g-jc-c">
									<div class="_top-1 g-flex-cc g-bg-white">
										<vcm-img
											:src="first.head_img_url || OSS['M_60']"
											style="width: 100px;"
										/>
									</div>
									<vcm-img
										:src="OSS['M_57']"
										class="g-absolute _rank-icon"
										style="width: 32px;"
									/>
								</div>
								<div
									class="g-tc g-c-white g-fs-14 g-m-t-20"
									style="font-weight: bold; height: 21px;"
								>
									{{ mode == 1 ? first.group_name : first.nick_name }}
								</div>
								<div
									class="g-flex-cc g-c-white g-fs-14 g-m-t-40"
								>
									<vcm-img :src="OSS['M_66']" style="width: 18px;" class="g-m-r-5" />
									<span class="_invite-num">{{ first.invite_num }}</span>
								</div>
							</div>
							<div
								v-if="second"
								class="_top"
								style="top: 132px; margin-left: -115px;"
							>
								<div class="g-relative g-flex g-jc-c">
									<div class="_top-2 g-flex-cc g-bg-white">
										<vcm-img
											:src="second.head_img_url || OSS['M_60']"
											style="width: 70px;"
										/>
									</div>
									<vcm-img
										:src="OSS['M_58']"
										class="g-absolute _rank-icon"
										style="width: 24px;"
									/>
								</div>
								<div
									class="g-tc g-c-white g-fs-14 g-m-t-16"
									style="font-weight: bold; height: 21px;"
								>
									{{ mode == 1 ? second.group_name : second.nick_name }}
								</div>
								<div
									class="g-flex-cc g-c-white g-fs-14 g-m-t-40"
								>
									<vcm-img :src="OSS['M_66']" style="width: 18px;" class="g-m-r-5" />
									<span class="_invite-num">{{ second.invite_num }}</span>
								</div>
							</div>
							<div
								v-if="third"
								class="_top"
								style="top: 156px; margin-left: 115px;"
							>
								<div class="g-relative g-flex g-jc-c">
									<div class="_top-3 g-flex-cc g-bg-white">
										<vcm-img
											:src="third.head_img_url || OSS['M_60']"
											style="width: 70px;"
										/>
									</div>
									<vcm-img
										:src="OSS['M_59']"
										class="g-absolute _rank-icon"
										style="width: 24px;"
									/>
								</div>
								<div
									class="g-tc g-c-white g-fs-14 g-m-t-16"
									style="font-weight: bold; height: 21px;"
								>
									{{ mode == 1 ? third.group_name : third.nick_name }}
								</div>
								<div
									class="g-flex-cc g-c-white g-fs-14 g-m-t-40"
								>
									<vcm-img :src="OSS['M_66']" style="width: 18px;" class="g-m-r-5" />
									<span class="_invite-num">{{ third.invite_num }}</span>
								</div>
							</div>
							<div class="_rank-wrap">
								<vcm-img
									:src="OSS['M_68']"
									style="width: 340px;"
								/>
							</div>
						</div>
						<div class="_self-wrap g-pd-lr-12">
							<div
								class="_self g-bg-white g-pd-tb-12 g-pd-l-12 g-pd-r-24 g-flex-ac g-jc-sb"
								style="line-height: 1.25;"
							>
								<div class="g-flex-ac g-col g-m-r-5">
									<span v-if="current.rank !== 0" class="_rank g-m-r-8 g-flex-cc g-fs-12">
										{{ current.rank }}
									</span>
									<span v-else class="g-m-lr-10">--</span>
									<vcm-img
										:src="current.head_img_url || OSS['M_60']"
										style="width: 44px; border-radius: 50%;"
										class="g-m-r-8"
									/>
									<div v-if="mode == 1" class="g-flex g-fd-c">
										<span class="g-fs-15 g-c-333 g-oneline">{{ current.group_name }}</span>
									</div>
									<div v-else class="g-flex g-fd-c g-fs-15 g-c-333">
										<span>{{ current.nick_name }}</span>
										<div class="g-flex g-ai-c g-fs-12 g-m-t-5">
											<span class="g-oneline g-col g-c-999 g-m-r-12">{{ current.user_name }}</span>
											<span
												style="color: #FF4D80; padding: 1px 3px; background: #FFEDF4; border-radius: 2px;"
											>
												{{ current.group_name }}
											</span>
										</div>
									</div>
								</div>
								<div class="g-flex g-fd-c g-ai-fe">
									<div class="g-flex-ac">
										<vcm-img :src="OSS['M_67']" style="width: 18px;" class="g-m-r-8" />
										<span class="g-fs-18 g-c-5f">{{ current.invite_num }}</span>
									</div>
									<span class="g-c-999 g-m-t-5">{{ type == 1 ? '亲密粉丝' : '所有粉丝' }}</span>
								</div>
							</div>
						</div>
					</div>
					<vcm-pull-scroll
						:show="item.value == type"
						:type="item.value"
						:data-source="listInfo[item.value].data"
						:total="listInfo[item.value].total"
						:count="listInfo[item.value].count"
						:reset="listInfo[item.value].reset"
						:current.sync="current[item.value]"
						:history="true"
						:load-data="loadData"
						wrapper
						:height="scrollHeight"
					>
						<template #default="it">
							<dxb-item :it="it.it" :type="type" :mode="mode" />
						</template>
					</vcm-pull-scroll>
				</vcm-tabs-pane>
			</vcm-tabs>
			<div
				v-if="showMode"
				class="_fix-tab g-flex g-fs-14"
				style="color: #FFBACC;"
				:style="{
					top: isRootUser ? '70px' : '24px'
				}"
			>
				<span
					class="g-col g-flex-cc"
					:class="{'_is-active': mode == 2}"
					@click="handleChangeMode('2')"
				>
					个人
				</span>
				<span
					class="g-col g-flex-cc"
					:class="{'_is-active': mode == 1}"
					@click="handleChangeMode('1')"
				>
					团队
				</span>
			</div>
			<div
				v-if="isRootUser"
				class="_fix-side-bt g-flex-cc g-pd-l-12"
				style="color: #FE6090;"
				:style="{
					top: isRootUser ? '70px' : '24px'
				}"
				@click="handleToInviteList"
			>
				<span class="g-fs-13 g-m-r-5">我的粉丝</span>
				<vcm-icon type="right" class="g-fs-10" />
			</div>
		</template>
	</div>
</template>

<script>
import { URL } from '@utils/utils';
import API from '@stores/apis/root';
import { OSS } from '@constants/constants';
import { MToast } from '@wya/vc';
import Empty from '@common/empty';
import Item from './item';

export default {
	name: 'dxb-table',
	components: {
		'dxb-item': Item,
		'dxb-empty': Empty,
	},
	data() {
		const { query } = this.$route;

		return {
			OSS,
			authData: {},
			mode: String(query.mode || "2"), // 个人 2 团队 1
			type: String(query.type || "1"), // 同tabs下的value
			tabs: [
				{ label: '亲密粉丝', value: '1' },
				{ label: '所有粉丝', value: '0' }
			],
			isRootUser: true, // 是否为种子用户
			status: '',
			loadedAuth: false,
			activity_model: 1, // 团队模式
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.inviteRanking.listInfo;
		},
		current() {
			return this.$store.state.inviteRanking.current;
		},
		scrollHeight() {
			return window.innerHeight - 398 - (this.isRootUser ? 45 : 0);
		},
		showMode() {
			return this.isRootUser && this.activity_model == 1;
		},
		errorTip() {
			const codeMap = {
				'-1001': {
					tip: '对不起，你当前没有操作权限',
					img: 'M_24'
				},
				'-1002': {
					tip: '对不起，来晚了，活动已结束啦~',
					img: 'M_39'
				}
			};
			return codeMap[this.status];
		},
		first() {
			let el = this.$store.state.inviteRanking.listInfo[this.type]
				&& this.$store.state.inviteRanking.listInfo[this.type].data.filter(v => v.rank === 1);
			return el.length === 1
				? el[0]
				: {
					head_img_url: this.OSS['M_71'],
					group_name: '虚位以待',
					nick_name: '虚位以待',
					invite_num: (el[0] && el[0].invite_num) || '-'
				};

		},
		second() {
			let el = this.$store.state.inviteRanking.listInfo[this.type]
				&& this.$store.state.inviteRanking.listInfo[this.type].data.filter(v => v.rank === 2);
			return el.length === 1
				? el[0]
				: {
					head_img_url: this.OSS['M_71'],
					group_name: '虚位以待',
					nick_name: '虚位以待',
					invite_num: (el[0] && el[0].invite_num) || '-'
				};
		},
		third() {
			let el = this.$store.state.inviteRanking.listInfo[this.type]
				&& this.$store.state.inviteRanking.listInfo[this.type].data.filter(v => v.rank === 3);
			return el.length === 1
				? el[0]
				: {
					head_img_url: this.OSS['M_71'],
					group_name: '虚位以待',
					nick_name: '虚位以待',
					invite_num: (el[0] && el[0].invite_num) || '-'
				};
		}
	},
	created() {
		this.loadAuth();
	},
	methods: {
		loadAuth() {
			this.$request({
				url: '_INVITE_RANKING_USER_IDENTITY_GET',
				type: 'GET',
				param: {
					activity_id: this.$route.query.activity_id,
				}
			}).then(res => {
				let current_identity = res.data.current_identity;
				let {
					status: activity_status,
					activity_model,
					activity_tool_type,
					activity_name
				} = res.data.activity_info;
				this.loadedAuth = true;
				this.authData = res.data;
				this.isRootUser = current_identity == 1;
				this.activity_model = activity_model;
				if (activity_tool_type == 2 || ([2, 3].includes(current_identity) && activity_model === 1)) {
					this.status = '-1001';
				} else if ([3, 4].includes(activity_status)) {
					this.status = '-1002';
					this.isRootUser && this.handleToInviteList();
				}
				document.title = activity_name;
			}).catch(e => {

			});
		},
		loadData(page, refresh) {
			let { query = {} } = URL.parse();
			let url;
			if (this.isRootUser) {
				url = this.mode == 2
					? 'INVITE_RANKING_PERSONAL_LIST_GET'
					: 'INVITE_RANKING_GROUP_LIST_GET';
			} else {
				url = 'INVITE_RANKING_PERSONAL_LIST_GET';
			}
			return this.request({
				url,
				type: 'GET',
				param: {
					...query,
					floor: this.type,
					page,
					activity_id: this.$route.query.activity_id,
				},
				refresh
			}).then((res) => {
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		handleChangeMode(mode) {
			if (mode == this.mode) return;
			this.mode = mode;
			let { query = {} } = URL.parse();
			query = {
				...query,
				mode,
			};
			this.$router.replace(URL.merge({ path: '/invite-ranking', query }));
			this.$store.commit('INVITE_RANKING_GROUP_LIST_INIT');
		},
		handleChange(type) {
			if (type == this.type) return;
			this.type = type;

			let { query = {} } = URL.parse();
			query = {
				...query,
				type,
			};
			this.$router.replace(URL.merge({ path: '/invite-ranking', query }));
			this.$store.commit('INVITE_RANKING_GROUP_LIST_INIT');
		},
		handleToInviteList() {
			this.$router.push(`/invite-list?type=1&activity_id=${this.authData.activity_info.activity_id}`);
		}
	}
};

</script>

<style lang="scss">
.v-invite-ranking {
	._tab-hide {
		.vcm-tabs__bar {
			display: none;
		}
	}
	.vcm-tabs__nav {
		background: #ffe0ea;
		.vcm-tabs__item {
			color: #8D6471;
		}
		.is-active {
			color: #FF4D80 !important;
		}
		.vcm-tabs__afloat {
			background: #FF4D80;
			width: 40px !important;
			margin-left: 12px;
		}
	}
	.vcm-tabs__bar {
		margin-bottom: 0px;
	}
	._top-wrap {
		height: 366px;
		overflow: hidden;
		._top {
			position: absolute;
			left: 50%;
			top: 75px;
			transform: translate(-50%, 0);
			z-index: 2;
		}
		._top-1 {
			width: 100px;
			height: 100px;
			border-radius: 50%;
			border: 4px solid #fff;
			overflow: hidden;
		}
		._top-2, ._top-3 {
			width: 70px;
			height: 70px;
			border-radius: 50%;
			border: 4px solid #fff;
			overflow: hidden;
		}
		._rank-icon {
			left: 50%;
			bottom: 0%;
			transform: translate(-50%, 50%);
		}
		._rank-wrap {
			position: absolute;
			bottom: -36px;
			left: 50%;
			transform: translate(-50%, 0);
			width: 340px;
			z-index: 1;
		}
		._invite-num {
			line-height: 1.25;
			font-size: 15px;
			font-weight: bold;
		}
	}
	._self-wrap {
		position: absolute;
		width: 100%;
		bottom: -40px;
		z-index: 9;
		._self {
			width: 100%;
			height: 70px;
			border-radius: 35px;
			box-shadow:0px 6px 12px 0px rgba(0, 0, 0, 0.09);
		}
	}
	._rank {
		border: 1px solid #eee;
		height: 24px;
		min-width: 24px;
		padding: 0 5px;
		border-radius: 12px;
		color: #8D6471;
	}
	._fix-side-bt {
		width: 90px;
		height: 32px;
		position: absolute;
		z-index: 99;
		right: 0;
		border-top-left-radius: 18px;
		border-bottom-left-radius: 18px;
		background: linear-gradient(90deg,rgba(255,255,255,1),rgba(255,245,91,1));
	}
	._fix-tab {
		width: 150px;
		height: 32px;
		position: absolute;
		z-index: 99;
		border-radius: 6px;
		left: 50%;
		overflow: hidden;
		transform: translate(-50%, 0);
		border: 1px solid #fff;
		._is-active {
			color: #F0326C;
			background: #fff;
		}
	}

}
</style>
