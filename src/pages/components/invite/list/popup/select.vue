<template>
	<vcm-popup
		v-model="show"
		class="v-invite-list-popup-select"
		placement="right"
	>
		<div class="g-flex g-fd-c" style="height: 100%;">
			<div class="g-col g-m-b-10">
				<div class="g-bb">
					<div class="g-fs-14 g-c-6 g-m-b-10">
						活动
					</div>
					<div
						class="g-flex g-fw-w"
						:style="{
							'max-height': `${$global.height - 200}px`,
							overflow: 'auto'
						}"
					>
						<div
							v-for="(item,index) in activity"
							:key="index"
							:class="item.is_select ? '_select' : '_noselect'"
							class="g-fs-14 g-m-r-8 g-m-b-8 _block g-flex-cc g-fd-c"
							@click="item.is_select = !item.is_select;"
						>
							<span>{{ activity_status[item.status - 1] }}</span>
							<span>{{ item.activity_name | substrText }}</span>
						</div>
					</div>
				</div>
				<div class="g-bb">
					<div class="g-fs-14 g-c-6 g-m-b-10 g-m-t-20">
						角色
					</div>
					<div class="g-flex g-fw-w">
						<div
							v-for="(item,index) in role"
							:key="index"
							:class="item.is_select ? '_select' : '_noselect'"
							class="g-fs-14 g-m-r-8 g-m-b-8 _block g-flex-cc"
							@click="item.is_select = !item.is_select;"
						>
							{{ item.name }}
						</div>
					</div>
				</div>
			</div>
			<div class="g-m-b-8 g-flex g-jc-fe _footer g-ai-fe">
				<div
					style="border: 1px solid #CDCDCD;"
					class="g-c-6 g-tc g-m-r-14 __button"
					@click="handleReset"
				>
					重置
				</div>
				<div
					style="background: #5CBA7C;"
					class="g-c-white g-tc g-m-r-10 __button"
					@click="handleOk"
				>
					确定
				</div>
			</div>
		</div>
	</vcm-popup>
</template>

<script>
import { Portal, MToast } from '@wya/vc';


const config = {
	name: 'v-invite-list-popup-select',
	filters: {
		substrText(v) {
			return v.length > 8 ? v.substr(0, 8) + '...' : v;
		}
	},
	props: {
		type: {
			type: Number
		},
		activityId: {
			type: String,
			default: ''
		},
		maxRole: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			activity: [],
			activity_status: ['未开始', '进行中', '已结束', '已删除'],
			role: [
				{
					is_select: false,
					name: '代理',
					max_role: 4
				},
				{
					is_select: false,
					name: '分享商',
					max_role: 3
				},
				{
					is_select: false,
					name: '会员',
					max_role: 2
				}
			],
			show: false
		};
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.show = true;
		this.role.forEach(v => {
			if (this.maxRole.split(',').includes('' + v.max_role)) {
				v.is_select = true;
			}
		});
	},
	methods: {
		loadData() {
			this.$request({
				url: "_INVITE_USER_SEARCH_ACTIVITY_GET",
				type: "GET",
				param: {
					type: this.type
				},
				loading: false
			}).then(res => {
				this.activity = res.data.map(item => ({
					...item,
					is_select: this.activityId.split(',').includes('' + item.activity_id)
				}));
			}).catch((res) => {
				MToast.info(res.msg, 1);
			});
		},
		handleClose() {
			this.show = false;
			this.$emit('close');
		},
		handleReset() {
			this.role.forEach(item => {
				item.is_select = false;
			});

			this.activity.forEach(item => {
				item.is_select = false;
			});
		},
		handleOk() {
			let maxRole = this.role.filter(item => item.is_select).map(item => item.max_role).join(',');
			let activityId = this.activity.filter(item => item.is_select).map(item => item.activity_id).join(',');
			this.$emit("sure", {
				max_role: maxRole,
				activity_id: activityId
			});
		}
	}
};

export default config;
export const Select = new Portal(config, {});
</script>

<style lang="scss">
.v-invite-list-popup-select {
    .vcm-popup__wrapper {
        width: 70%;
        padding: 8px;
    }

    ._block {
        padding: 0px 12px;
		height: 40px;
        border-radius:6px;
		line-height: 1.25;
    }

    ._select{
        color: #26BE76;
        background: rgba(38,190,118,0.1);
        border:1px solid rgb(38,190,118);
    }

    ._noselect {
        color: #666666;
        background: #F2F2F2;
        border:1px solid #F2F2F2;
    }

    ._footer {
        height: 48px;

        .__button {
            width: 85px;
            height: 36px;
            line-height: 36px;
            border-radius:18px;
        }
    }
}
</style>
