<template>
	<div class="v-reward-list">
		<xls-header class="g-flex-none" />
		<vcm-tabs
			:value="type"
			:animated="false"
			class="g-flex-auto"
			@click="handleChange"
		>
			<vcm-tabs-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
			>
				<vcm-pull-scroll
					:show="item.value == type"
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:count="listInfo[item.value].count"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:height="scrollHeight"
					:load-data="loadData"
					wrapper
				>
					<template #default="{ it }">
						<xls-item
							:it="it"
							:type="type"
							class="_item"
						/>
					</template>
				</vcm-pull-scroll>
			</vcm-tabs-pane>
		</vcm-tabs>
		<dxb-fix-qrcode />
	</div>
</template>

<script>
import { URL } from '@utils/utils';
import QrCode from '@common/qrcode/qrcode';
import Item from './item';
import Header from './header';

export default {
	name: 'xls-table',
	components: {
		'xls-item': Item,
		'xls-header': Header,
		'dxb-fix-qrcode': QrCode
	},
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '抽奖奖励', value: '1' },
				{ label: '分享奖励', value: '2' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.rewardList.listInfo;
		},
		scrollHeight() {
			return window.innerHeight - 130 - this.$global.navHeight;
		}
	},
	methods: {
		loadData(page, refresh) {
			let url = +this.type === 1 ? 'REWARD_PRIZE_LIST_GET' : 'REWARD_REWARD_LIST_GET';

			return this.request({
				url,
				type: 'GET',
				param: {
					page,
					type: this.type
				},
				refresh
			}).then((res) => {
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		handleChange(type) {
			if (this.type == type) {
				return;
			}
			this.type = type;
			let { query = {} } = URL.parse(); // this.$route需要设置scroll.sync
			query = {
				...query,
				type
			};

			this.$router.replace(URL.merge({ path: '/reward-list', query }));
		}
	}
};
</script>

<style lang="scss">
.v-reward-list {
	// display: flex;
	// flex-direction: column;
	// flex: auto;
	// .vcm-tabs {
	// 	display: flex;
	// 	flex-direction: column;
	// }
	// .vcm-tabs__bar {
	// 	flex: none;
	// }
	// .vcm-tabs__content {
	// 	flex: auto;
	// 	flex-direction: column;
	// 	.vcm-tabs-pane {

	// 	}

	// }

}
</style>
