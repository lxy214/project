<template>
	<div class="g-reset c-set-title">
		<div class="_set-title-content g-relative">
			<slot />
		</div>
		<div v-if="showNav" ref="nav" class="_set-title-nav">
			<xls-footer-nav
				:data-source="navData"
			/>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import FootNav from '@common/footer-nav/footer-nav';
import { Storage } from '@utils/utils';

import DebugManager from '@xls/public/src/funcs/debug-manager';
import HackManager from '@xls/public/src/funcs/hack-manager';
import WxManager from '@utils/wx-manager';
import API_ROOT from '@stores/apis/root';
import { DEBUG } from '@constants/constants';
import { convertStyle, getWindowHeight } from '@xls/public/src/components/set-title/hack';

let hack = new HackManager();
let debug = new DebugManager({ force: DEBUG });
let wx = new WxManager({
	system: 'dxb',
	signature: {
		url: API_ROOT._WECHAT_SIGNATURE_URL,
		onBefore({ options }) {
			return {
				...options,
				headers: {
					token: app.$global.user.token
				}
			};
		}
	},
	location: {
		key: ['lat', 'lng']
	}
});

Vue.prototype.$wx = wx;
window.$wx = wx;

let navData = [];
const NAV_PAGES = [
	'/product-main',
	'/order-list',
	'/poster-main',
	'/reward-list',
	'/invite-list'
];

export default {
	name: "set-title",
	components: {
		'xls-footer-nav': FootNav
	},
	props: {
		title: String,
		back: {
			default: true,
			type: Boolean
		},
		offset: {
			type: Number,
			default: -45
		},
		share: {
			type: Boolean,
			default: true,
		}

	},
	data() {
		return {
			path: this.$route.path,
			navData,
			fullStyle: undefined
		};
	},
	computed: {
		showNav() {
			return this.navData.length
				&& NAV_PAGES.some(v => this.$route.path.includes(v));
		}
	},

	created() {
		this.share && this.$wx.reset();
		// window.addEventListener('resize', this.updateStyle);
	},
	mounted() {
		document.title = this.title || document.title;
		// 先从 session里面获取活动id
		let activity_id = this.$route.query.activity_id;
		let activity_tool_type = this.$route.query.activity_tool_type;
		let cache_id = Storage.get('activity_id', { session: true });
		let cache_tool_type = Storage.get('activity_tool_type', { session: true });
		if (activity_id && activity_id !== cache_id) {
			Storage.set('activity_id', activity_id, { session: true });
		}
		if (activity_tool_type && activity_tool_type !== cache_tool_type) {
			Storage.set('activity_tool_type', activity_tool_type, { session: true });
			cache_tool_type = activity_tool_type;
		}
		// 加载底部导航
		let hasNav = NAV_PAGES.some(v => this.$route.path.includes(v));
		hasNav && (activity_id || cache_id) && cache_tool_type == 1 && this.loadNav();
		// this.updateStyle();
	},
	beforeDestroy() {
		// window.removeEventListener('resize', this.updateStyle);
	},
	methods: {
		handleClick() {
			this.$router.back();
		},
		loadNav() {
			let activity_id = Storage.get('activity_id', { session: true });
			this.$request({
				url: "_COMMON_FOOTER_NAV_GET",
				type: "GET",
				param: {
					activity_id
				},
				loading: false,
				errorTip: false
			}).then(res => {
				let path = this.$route.path;
				if (!res.data.is_open_bottom_decoration) {
					this.navData = [];
					navData = [];
					return;
				}
				if (JSON.stringify(this.navData) === JSON.stringify(res.data.bottom_decoration)) {
					return;
				}
				this.navData = res.data.bottom_decoration;
				navData = res.data.bottom_decoration;
				this.$nextTick(() => {
					this.$global.navHeight = (this.showNav && this.$refs.nav && this.$refs.nav.clientHeight) || 0;
				});
			}).catch((res) => {
				this.navData = [];
				navData = [];
			});
		},
		updateStyle() {
			const convertedStyle = convertStyle(this.fullStyle, getWindowHeight());
			this.fullStyle = convertedStyle;
		},

	}
};
</script>
<style lang="scss">
.c-set-title {
	width: 100vw;
	height: 100vh;
	overflow: auto;
	display: flex;
	flex-direction: column;
	._set-title-content {
		& > div {
			&:first-of-type {
				flex: 1;
				overflow: auto;

			}
		}
		display: flex;
		flex: 1;
		overflow: auto;
	}
	._set-title-nav {
		flex: 0 0 auto
	}
}
</style>
