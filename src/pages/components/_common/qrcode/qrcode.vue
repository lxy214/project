<template>
	<div
		v-if="attractInfo.drainage_type !== 1 && attractInfo.is_join === 1"
		class="_qrcode-wrap g-fs-18"
		@click="handleShowQrcode"
	>
		<div class="g-relative">
			<vc-img :src="OSS['M_54']" style="width: 78px;" />
			<span
				class="g-absolute _qrcode-text"
			>
				{{ attractInfo.drainage_type === 2 ? '进社群' : '加微信' }}
			</span>
		</div>
	</div>
</template>
<script>

import { Storage } from '@utils/utils';
import { PressCode } from '@components/_common/press-code/press-code';
import { OSS } from '@constants/constants';

export default {
	name: 'xls-fix-qrcode',
	data() {
		return {
			OSS,
			attractInfo: {}
		};
	},
	mounted() {
		let activity_id = this.$route.query.activity_id;
		let cache_id = Storage.get('activity_id', { session: true });

		if (activity_id && activity_id !== cache_id) {
			Storage.set('activity_id', activity_id, { session: true });
		}

		let activity_tool_type = this.$route.query.activity_tool_type;
		let cache_tool_type = Storage.get('activity_tool_type', { session: true });

		if (activity_tool_type && activity_tool_type !== cache_tool_type) {
			Storage.set('activity_tool_type', activity_tool_type, { session: true });
			cache_tool_type = activity_tool_type;
		}

		// 加载悬浮引流二维码
		(activity_id || cache_id) && cache_tool_type == 1 && this.loadAttractQrcode();
	},
	methods: {
		loadAttractQrcode() {
			let activity_id = Storage.get('activity_id', { session: true });
			this.$request({
				url: '_ACTIVITY_FISSION_CODE_GET',
				type: 'GET',
				param: {
					activity_id
				}
			}).then(res => {
				this.attractInfo = res.data;
				this.$emit('loaded-code', res.data);
				return res;
			}).catch(e => {
				this.$emit('loaded-code', undefined);
				console.error(e);
			});
		},
		handleShowQrcode() {
			let {
				qr_code,
				is_group_full,
				qr_code_tips
			} = this.attractInfo;
			PressCode.popup({
				codeUrl: is_group_full ? this.$config.qr_code : qr_code,
				msg: qr_code_tips
			}).then().catch(e => {});
		}
	}
};
</script>
<style lang="scss">
._qrcode-wrap {
	position: absolute;
	right: 0px;
	bottom: 76px;
	z-index: 11;
	._qrcode-text {
		bottom: 3px;
		left: 50%;
		transform: translate(-50%, 0);
		font-size: 9px;
		color: #883c1d;
	}
}
</style>
