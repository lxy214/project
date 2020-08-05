<template>
	<div :key="tableKey" class="v-attract-turntable-container" :style="{ transform: 'rotate('+rotateDeg+'deg)',width:dpx,height:dpx}">
		<div
			v-for="(item,index) in list.filter((i,index)=>index>=0) "
			:key="index"
			style="    
				position: absolute;
				background:transparent;
				transform-origin: 0% 50%;"
			:style="{ transform: 'rotate('+(index*avgDeg-avgDeg/2)+'deg)',width:rpx,height:dpx,left:rpx}"
		>
			<div
				class="_select"
				:style="{width:rpx,height:dpx,'border-top-right-radius': rpx,'border-bottom-right-radius': rpx}"
			>
				<div
					class="_left" 
					:style="{background:colors[index],transform: 'rotate('+avgDeg+'deg)',width:rpx,height:dpx,left:'-'+rpx}"
				>
					<div
						class="g-tc g-pd-12"
						style="
							height: 100%;
							width: 100%;
							transform-origin: 50% 50%;
							position: absolute;
							left: 50%;"
						:style="{'transform':'rotate('+(avgDeg/2*-1)+'deg)',color:'black'}"
					>
						<span style="margin-top:0px" class="g-dp-ib">{{ item.name }}</span><br>
						
						<span v-if="item.price" style="margin-top:0px" class="g-dp-ib">¥ {{ item.price }}</span><br v-if="item.price">
						<img :src="item.img+'!2-2'" style="max-width:32px;max-height:32px;margin-top:4px" class="g-dp-ib">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { OSS } from '@constants/constants';
import { sleep } from '@utils/utils';

export default {
	name: 'xls-turn-table',
	components: {
	},
	props: {
		list: {
			type: Array,
			default: () => [
				// { name: '红包200', price: '100', img: OSS.M_19, id: 1 },
				// { name: '红包300', price: '200', img: OSS.M_19, id: 2 },
				// { name: '红包400', price: '300', img: OSS.M_19, id: 3 },
				// { name: '红包500', price: '400', img: OSS.M_19, id: 4 },
				// { name: '红包600', price: '500', img: OSS.M_19, id: 5 }
				//  { name: '红包700', price: '600', img: OSS.M_19, id: 6 }
			]
		},
		endId: {
			type: Number,
			default: 3
		},
		size: {
			type: Number,
			default: 262
		},
		panecolor: {
			type: Array,
			default: () => ['#ff9fa4', '#ffffff', '#f48e97']
		}
	},
	data() {
		return {
			M_21: OSS.M_21,
			M_19: OSS.M_19,
			a: 1,
			turnDeg: 0,
			rotateDeg: 0,
			inTurning: false,
			tableKey: 1
		}; 
	},

	computed: {
		avgDeg() {
			return 360 / this.list.length;
		},
		// 直径
		dpx() {
			return this.size + 'px';
		},
		// 半径
		rpx() {
			return this.size / 2 + 'px';
		},
		colors() {
			if (this.list.length % 2 == 1) {
				return this.list.map((i, index) => this.panecolor[index % 3]);
			} else {
				return this.list.map((i, index) => this.panecolor[index % 2]);
			}
		}
			
	},
	mounted() {
	},
	beforeDestroy() {
		let style = document.styleSheets[1];
		if (style && style.cssRules[0].name === 'turntable-spin') {
			style.deleteRule(0); // 删除上次的样式
		}
	},
	methods: {
		start() {
			if (this.inTurning) return;
			this.inTurning = true;
			this.insertKeyframes();
		
		},
		async insertKeyframes() {
			const index = this.list.findIndex(it => it.id == this.endId);
			const radius = 3600 - index * this.avgDeg;
			let style = document.styleSheets[1];
			if (style.cssRules[0].name === 'turntable-spin') {
				style.deleteRule(0); // 删除上次的样式
			}
			await sleep(0.1); 
			const cssRule = `@keyframes turntable-spin {
    			0% {
       				transform: rotate(0deg);
   				}
    			100% {  
        			transform: rotate(${radius}deg);
    			}
			}`;
			style.insertRule(cssRule);// 写入样式

			// 兼容ios，替换容器触发动画
			this.tableKey++;
			await sleep(5);
			this.inTurning = false;
			this.$emit('end');
		},
		

	}
};

</script>
<style lang="scss">
.v-attract-turntable-container {
	// width:300px;
	// height: 300px;
	border-radius: 50%;
	// border: 1px solid;
	position: relative;

	animation: turntable-spin 5s cubic-bezier(0.62, 0.03, 0.5, 0.98) 0s 1 normal forwards ;
	// 动画名称 + 动画持续时间 + 动画速度曲线 + 动画延迟时间 + 动画执行次数（number or infinite）+ 动画方向 + 动画的最后时间点时的状态，取值有：backward（回到初始状态）、forwards（停在最终状态）、none、both。
	._select {
		//border: 1px solid;
		// width:150px;
		// height:300px;
		// border-top-right-radius: 150px;
		// border-bottom-right-radius: 150px;
		overflow: hidden;
		position: absolute;
		background: transparent;
		._left {
			// width:150px;
			// height:300px;
			// left:-150px;
			//transform: rotate(60deg);
			background: #8cc6e7;
			transform-origin: 100% 50%;
			position: absolute;
		}
	}
	._pane {
		position: absolute;
		color: rgb(255, 192, 203);
		
	}

}
</style>