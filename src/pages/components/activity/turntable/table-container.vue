<template>
	<div class="v-attract-tool-turntable-container">
		<div class="_table-bg" :style="'background-image:url('+bgImg+');'">
			<div class="g-center g-relative" :style="{height:size+100+'px',marginTop:150+'px'}">
				<img :src="M_50" class="g-absolute" :style="{width:size+100+'px'}">
				<dxb-t-table
					v-show="tableOpt.list && tableOpt.list.length"
					ref="turn"
					class="g-absolute"
					:size="size"
					v-bind="tableOpt ||{}"
					@end="handleEnd"
				/>
				<img :src="M_1" class="g-absolute" :style="{width:size+10+'px'}">
				<img :src="M_22" class="g-absolute g-pointer" style="width:60px" @click="handleStart">
			</div>
			<slot />
			<div v-if="decorateData.decorate_show_list && decorateData.personList.length" class="g-pd-lr-30 g-c-white g-center">
				<div style="width:300px">
					<div class="g-tc g-fs-16 _scroll-header">
						中奖名单
					</div>
					<div ref="personList" class="_scroll-container" style="padding-top: 0px">
						<div v-for="(person,index) in decorateData.personList" :key="index" class="g-flex g-jc-sb g-ai-c _prize-person">
							<div style="height:26px">
								<img :src="person.img" alt="" style="width:26px;height:26px;border-radius:50%" class="g-inline-block">
								<span class="g-m-l-8 g-fs-14">{{ person.name }}</span>
							</div>
							<div class="g-fs-14">
								获得{{ person.prize_name }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="g-pd-lr-30 g-c-white g-center">
				<div class="g-m-t-20" style="width:300px">
					<div class="g-tl g-fs-14 g-c-white _scroll-header">
						活动说明
					</div>
					<div class="_scroll-container" style="padding: 0px 0px 12px 0px;max-height: 80px;">
						<vc-editor-view :content="decorateData.decorate_explain" />
					</div>
				</div>
			</div>
			<div style="height:30px" />
		</div>
	</div>
</template>
<script>
import { OSS } from '@constants/constants';
import Ttable from './turntable';

const { M_1, M_22, M_21, M_19, M_20, M_44, M_43, M_49, M_48, M_50 } = OSS;
export default {
	name: 'xls-',
	components: {
		'dxb-t-table': Ttable
	},
	props: {
		tableOpt: Object,
		decorateData: Object,
		beforeStart: Function

	},
	data() {
		return {
			M_1,
			M_22,
			M_50,
			M_21,
			M_19,
			M_20,
			size: 246,
			tableKey: 1

		};
	},
	computed: {
		bgImg() {
			return this.decorateData.decorate_custom ? this.decorateData.decorate_bg : M_48;
		}

	},
	watch: {
		'decorateData.decorate_show_list': {
			immediate: true,
			handler(val) {
				if (val) {
					clearInterval(this.scrollTimer);
					this.startScroll();
				} else {
					clearInterval(this.scrollTimer);
				}
			}
		}

	},

	destroyed() {
		clearInterval(this.scrollTimer);
	},
	
	methods: {
		handleEnd() {
			this.$emit('end');
		},
		async handleStart() {
			try {
				if (this.$refs.turn.inTurning) return;
				if (this.beforeStart) {
					await this.beforeStart();
				}
				setTimeout(this.$refs.turn.start, 10);
			} catch (e) {
				console.log(e);
			}
		},
		startScroll() {
			this.$nextTick(() => {
				const element = this.$refs.personList;
				if (!element) return;
				let scrollHeight = element.scrollHeight;
				let clientHeight = element.clientHeight;
				if (scrollHeight - clientHeight < 15) return;
				const fn = () => {
					element.scrollTop += 1;
					if (element.scrollTop >= scrollHeight - clientHeight) {
						element.scrollTop = 0;
					}
				};
				this.scrollTimer = setInterval(() => {
					requestAnimationFrame(fn);
				}, 60);
			});
		}
	}
};
</script>
<style lang="scss">
.v-attract-tool-turntable-container  {
	// width: 375px;
	// height: 667px;
	overflow: auto;
	._table-bg {
		background-size:100% auto;
		background-repeat: no-repeat;
		overflow: auto;
		margin-left: -1px;
		margin-right: -1px;
	}
	._scroll-header {
		background: rgba(0,0,0,0.2);
		color: white;
		padding:8px ;
		border-radius: 10px 10px 0 0;
	}
	._scroll-container {
		background: rgba(0,0,0,0.2);
		padding: 12px;
		max-height: 140px;
		overflow: auto;
		border-radius: 0 0 10px 10px;
		._prize-person {
			margin-bottom: 10px;
		
		}
	}
	.ql-editor  {
		padding:0 8px;
	}
}
</style>