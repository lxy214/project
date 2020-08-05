<template>
	<div :key="it.id" class="g-bg-white v-invite-ranking-item">
		<div
			class="g-m-lr-12 g-bb g-flex g-ai-c g-pd-lr-10 g-pd-tb-16 g-jc-sb"
			style="height: 76px; line-height: 1.25;"
		>
			<div class="g-flex-ac">
				<span class="_rank g-m-r-8 g-flex-cc g-fs-12">
					{{ it.rank }}
				</span>
				<vcm-img
					:src="it.head_img_url || OSS['M_60']"
					style="width: 44px; border-radius: 50%;"
					class="g-m-r-8"
				/>
				<div v-if="mode == 1" class="g-flex g-fd-c">
					<span class="g-fs-15 g-c-333 g-oneline">{{ it.group_name }}</span>
				</div>
				<div v-else class="g-flex g-fd-c g-fs-15 g-c-333">
					<span>{{ it.nick_name }}</span>
					<div class="g-flex g-ai-c g-fs-12 g-m-t-5">
						<span class="g-oneline g-col g-c-999 g-m-r-12">{{ it.user_name }}</span>
						<span
							style="color: #FF4D80; padding: 1px 3px; background: #FFEDF4; border-radius: 2px;"
						>
							{{ it.group_name }}
						</span>
					</div>
				</div>
			</div>
			<div class="g-flex g-fd-c g-ai-fe">
				<div class="g-flex-ac">
					<vcm-img :src="OSS['M_67']" style="width: 18px;" class="g-m-r-8" />
					<span class="g-fs-18 g-c-5f">{{ it.invite_num }}</span>
				</div>
				<span class="g-c-999 g-m-t-5">{{ type == 1 ? '亲密粉丝' : '所有粉丝' }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { OSS } from '@constants/constants';

export default {
	name: "dxb-item",
	props: {
		it: Object,
		type: [String, Number],
		mode: [String, Number]
	},
	data() {
		return {
			OSS
		};
	},
	methods: {
		handleInit() {
			this.$store.commit('INVITE_RANKING_LIST_INIT');
		}
	}
};
</script>
<style lang="scss">
.v-invite-ranking-item {
}
</style>
