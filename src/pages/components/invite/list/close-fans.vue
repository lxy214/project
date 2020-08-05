<template>
	<div class="v-invite-list-close-fans g-bg-white">
		<div class="g-flex g-pd-l-12 g-pd-t-8">
			<img
				v-if="it.head_img_url"
				:src="it.head_img_url"
				class="_head"
			>

			<div class="g-flex g-jc-sb g-bb g-pd-r-12 g-pd-b-8 g-m-l-15" style="width: 100%;">
				<div class="g-flex g-fd-c g-col">
					<div class="g-flex-ac">
						<div class="g-fs-14 g-c-0">
							{{ it.nick_name }}
						</div>
						<div v-if="it.sex" class="g-m-l-5">
							<vcm-icon
								:type="+it.sex === 1 ? 'm-nan' : 'm-nv'"
								:style="{
									color: +it.sex === 1 ? '#578FF2' : '#FF97B2'
								}"
							/>
						</div>
					</div>
					<div class="g-c-6">
						{{ it.province }}{{ it.city }}
					</div>
					<div class="g-c-6 g-oneline">
						{{ it.activity_name }}
					</div>
				</div>

				<div class="g-flex g-flex-ac g-col">
					<div class="g-m-r-10" style="min-width: 120px;">
						<div>
							<span class="g-fs-14 g-c-0">
								{{ it.user_name }}
							</span>
							<span class="g-tc g-c-white _lable">
								{{ ['会员','分享商','代理'][it.max_role - 2] }}
							</span>
						</div>
						<div v-if="it.mobile" class="g-c-0 g-flex-ac">
							<div
								class="g-flex-cc g-m-r-5"
								style="padding: 2px; background: #578FF2; border-radius:2px;"
							>
								<vcm-icon type="m-phone" class="g-fs-12 g-c-white" />
							</div>
							<a :href="`tel:${it.mobile}`">{{ it.mobile }}</a>
						</div>
						<div v-if="it.wechat" class="g-flex g-col">
							<div
								class="g-flex-cc g-m-r-5"
								style="padding: 2px; background: #83c663; border-radius:2px;"
							>
								<vcm-icon type="wechat" class="g-fs-12 g-c-white" />
							</div>
							<span class="g-m-r-5 g-col g-oneline" style="word-break: break-all;">
								{{ it.wechat }}
							</span>
							<vc-clipboard
								:value="it.wechat"
								tag="span"
								style="color:#108DE7"
								@after="() => MToast.info('复制成功', 2)"
							>
								复制
							</vc-clipboard>
						</div>
					</div>

					<vcm-icon
						:type="collectList.includes(it.user_id) ? 'm-collected' : 'm-collect'"
						class="g-fs-16 g-c-cd"
						:style="{
							color: collectList.includes(it.user_id) ? '#FEBB2B !important' : '#cdcdcd'
						}"
						@click="handleCollect"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { MToast } from '@wya/vc';

export default {
	name: 'xls-close-fans',
	props: {
		it: {
			type: Object
		},
		collectList: {
			type: Array
		},
		type: {
			type: Number
		}
	},
	data() {
		return {
			MToast
		};
	},
	methods: {
		handleAfter() {},
		handleCollect() {
			this.$request({
				url: "_INVITE_USER_COLLECT_POST",
				type: "POST",
				param: {
					user_id: this.it.user_id,
					is_collect: this.collectList.includes(this.it.user_id) ? 0 : 1
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
.v-invite-list-close-fans {
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
}
</style>
