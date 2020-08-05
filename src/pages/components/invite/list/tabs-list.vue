/* eslint-disable vue/html-end-tags */
<template>
	<div class="v-invite-list-tabs-list">
		<div class="g-pd-12 g-flex g-flex-ac g-jc-sb">
			<div class="g-bg-white g-flex g-flex-ac g-pd-l-15 g-col _search">
				<vcm-icon type="search" class="g-c-9 g-fs-14" />
				<vcm-input
					v-model="search"
					placeholder="输入电话/姓名/昵称搜索"
					class="g-m-r-10"
					clearable
					@enter="handleSearch"
					@change="handleInputChange"
				/>
			</div>
			<div class="g-flex g-flex-ac" style="color: #4787F2;">
				<span
					class="g-fs-14 g-m-lr-5"
					@click="handleSearch"
				>
					搜索
				</span>
				<span>|</span>
				<vcm-icon type="filter" class="g-fs-14 g-m-lr-5" />
				<span class="g-fs-14" @click="handleSelect">筛选</span>
			</div>
		</div>

		<div class="g-flex g-jc-sb g-bb _total">
			<div class="g-bg-white g-pd-t-5 __left">
				<div class="g-fs-16 g-c-0 g-tc">
					{{ relation.invite_total }}
				</div>
				<div class="g-tc g-c-9">
					累计粉丝量
				</div>
			</div>
			<div class="g-bg-white g-pd-t-5 __right">
				<div class="g-fs-16 g-c-0 g-tc">
					{{ relation.agent_total }}
				</div>
				<div class="g-tc g-c-9">
					已转化为代理
				</div>
			</div>
		</div>

		<vcm-tabs
			:value="type"
			:animated="false"
			@click="handleChange"
		>
			<vcm-tabs-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
			>
				<div
					v-if="+type === 1"
					class="g-bg-white g-c-0 g-fs-15 g-flex g-jc-sb g-pd-lr-12 g-pd-tb-15"
				>
					<span>粉丝A</span>
					<span>{{ listInfo[item.value].count }}</span>
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
					:height="scrollHeight"
					wrapper
				>
					<!-- :empty-text="renderEmptyList" -->
					<template #default="it">
						<xls-close-fans
							v-if="type != 2"
							:index="+it.index"
							:it="it.it"
							:type="+type"
							:collect-list="collectList"
							@collect="loadCollectData"
						/>
						<xls-item
							v-if="type == 2"
							v-model="expandIds"
							:it="it"
							:collect-list="collectList"
							class="_item"
							@collect="loadCollectData"
						/>
					</template>
				</vcm-pull-scroll>
			</vcm-tabs-pane>
		</vcm-tabs>
	</div>
</template>

<script>
import { URL } from '@utils/utils';
import { MToast } from '@wya/vc';
import Item from './item';
import CloseFans from './close-fans';
import { Select } from './popup/select';

export default {
	name: 'xls-table',
	components: {
		'xls-item': Item,
		'xls-close-fans': CloseFans
	},
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '亲密粉丝', value: '1' },
				{ label: '所有粉丝', value: '2' },
				{ label: '我的收藏', value: '3' }
			],
			visible: false,
			relation: {},
			search: String(query.search || ""),
			collectList: [],
			maxRole: String(query.maxRole || ""),
			activityId: String(query.activityId || ""),
			expandIds: []
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.inviteList.listInfo;
		},
		scrollHeight() {
			return window.innerHeight - 216;
		}
	},
	created() {
		this.loadRelationData();
		this.loadCollectData();
	},
	methods: {
		loadData(page, refresh) {
			let { query = {} } = URL.parse();
			let API = ['INVITE_DIRECT_RELATION_LIST_GET', 'INVITE_RELATION_LIST_GET', 'INVITE_COLLECT_LIST_GET'][this.type - 1];

			return this.request({
				url: API,
				type: 'GET',
				param: {
					...query,
					page,
					type: this.type,
					search: this.search,
					max_role: this.maxRole,
					activity_id: this.activityId
				},
				refresh
			}).then((res) => {
			}).catch((error) => {
				MToast.info(error.msg, 1);
			});
		},
		loadRelationData() {
			let {
				activity_id,
				activityId,
				...rest
			} = this.$route.query;
			this.$request({
				url: "_INVITE_USER_RELATION_STATISTICS_GET",
				type: "GET",
				loading: false,
				param: {
					...rest,
					activity_id: activityId,
				}
			}).then(res => {
				this.relation = res.data;
			}).catch((res) => {
				MToast.info(res.msg, 1);
			});
		},
		loadCollectData() {
			this.$request({
				url: "_INVITE_COLLECT_USER_IDS_LIST_GET",
				type: "GET",
				loading: false,
				successTip: false
			}).then(res => {
				this.collectList = res.data;
				let store = ['INVITE_DIRECT_RELATION_LIST_GET_INIT', 'INVITE_RELATION_LIST_GET_INIT', 'INVITE_COLLECT_LIST_GET_INIT'][this.type - 1];
				this.$store.commit(store);
			}).catch((res) => {
				MToast.info(res.msg, 1);
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = URL.parse(); // this.$route需要设置scroll.sync
			query = {
				...query,
				type
			};

			this.$router.replace(URL.merge({ path: '/invite-list', query }));
		},
		handleSearch() {
			this.handleChangeQuery();
			let store = ['INVITE_DIRECT_RELATION_LIST_GET_INIT', 'INVITE_RELATION_LIST_GET_INIT', 'INVITE_COLLECT_LIST_GET_INIT'][this.type - 1];
			this.$store.commit(store);
		},
		handleChangeQuery() {
			let { query = {} } = URL.parse();

			query = {
				...query,
				search: this.search,
				type: this.type,
				max_role: this.maxRole,
				activityId: this.activityId
			};

			this.$router.replace(URL.merge({ path: '/invite-list', query }));
		},
		handleSelect() {
			Select.popup({
				type: +this.type,
				activityId: this.activityId,
				maxRole: this.maxRole
			}).then(res => {
				if (this.activityId === res.activity_id && this.maxRole === res.max_role) {
					return;
				}
				this.activityId = res.activity_id;
				this.maxRole = res.max_role;
				this.handleChangeQuery();
				this.loadRelationData();
				let store = ['INVITE_DIRECT_RELATION_LIST_GET_INIT', 'INVITE_RELATION_LIST_GET_INIT', 'INVITE_COLLECT_LIST_GET_INIT'][this.type - 1];
				this.$store.commit(store);
			});
		},
		renderEmptyList() {
			return "没用内容可供显示";
		},
		handleInputChange(event) {
			console.log(event);
			if (!event.target.value) {
				this.handleSearch();
			}

		}
	}
};
</script>

<style lang="scss">
.v-invite-list-tabs-list {
	._search {
		height: 28px;
		border-radius:14px;

		// .vcm-input {
		// 	width: 80%;
		// 	font-size: 14px;
		// }

		.vcm-input__content {
			input {
				font-size: 13px;
				line-height: 24px;
				// top: 3px;
			}
		}
	}

	._total {
		height: 60px;

		.__left,.__right {
			width: 49.9%;
			height: 60px;
		}
	}

	.vc-pull-scroll-scroll-status {
		& > span {
			padding: 0px 20px;
		}
	}
}

.v-invite-tab-list-dropdown {
	max-width: 60%;
	overflow: auto;

	.vcm-checkbox-group {
		padding: 10px;

		.vcm-checkbox {
			color: #333333;
			font-size: 14px;
		}
	}

	._button {
		width: 100px;
		height: 24px;
		line-height: 24px;
		text-align: center;
		background: #578FF2;
		border-radius:4px;
	}
}
</style>
