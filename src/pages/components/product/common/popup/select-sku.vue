<template>
	<vcm-popup 
		v-model="visible"
		class="v-product-select-sku"
	>
		<div class="g-pd-12">
			<div class="g-flex">
				<img :src="curSku.image_url+'!2-2'" class="g-m-r-12" style="max-width:80px;max-height:80px">
				<div class="g-col">
					<div class="g-tr">
						<vc-icon type="m-close" @click="handleCancel" />
					</div>
					
					<div class="g-c-red-mid g-fs-14 g-m-t-4">
						¥{{ curSku.activity_price }}
					</div>
					<div class="g-c-0 g-fs-14 g-m-t-4">
						库存 {{ curSku.activity_stock }} 份
					</div>
					<div v-if="curSku.spec_value_names && curSku.spec_value_names.length" class="g-c-0 g-fs-14 g-m-t-4">
						已选： 
						<span v-for="(i,index) in curSku.spec_value_names" :key="index">
							{{ i }} {{ index==curSku.spec_value_names.length-1?'':'*' }}
						</span>
					</div>
				</div>
			</div>
			<!-- <div class="g-c-0 g-fs-14 g-m-tb-8">
				规格
			</div> -->
			<div v-if="skuNum>0" class="g-m-t-8 scroll-container" style="max-height:150px;overflow:auto">
				<dxb-sku :sku="parsedSku" :selected="selectedSku" @click="handleSkuClick" />
			</div>
			
			<div style="border-top:1px solid #F2F2F2;margin:12px -12px" />
			<div class="g-flex g-jc-sb g-ai-c g-pd-b-12 ">
				<div>
					购买数量
				</div>
				<div>
					<dxb-number-add v-model="num" :max="limitQuantity" />
				</div>
			</div>
		</div>
		<div class="g-center g-c-white g-fs-16" style="height:48px;background:rgba(38,190,118,1);" @click="handleOk"> 
			确定
		</div>
	</vcm-popup>
</template>
<script>
import { Portal } from '@wya/vc';
import NumberAdd from '@common/number-add/number-add';
import { OSS } from '@constants/constants';
import SkuItem from './sku';

const com = {
	name: 'xls-template-modal',
	components: {
		'dxb-number-add': NumberAdd,
		'dxb-sku': SkuItem
	},
	props: {
		sku: Array,
		skuSn: String, // 选中的规格
		quantity: { // 购买数量
			type: Number,
			default: 1
		},
		productName: String,
		skuNum: Number, // 规格类型数量，0为无规格（实际只有一种）
		limitNum: Number // 限购数量// -1时为不限购
	},
	data() {
		let selectedSku;
		if (this.skuSn) {
			const exist = this.sku.find(item => item.sku_sn === this.skuSn);
			if (exist && exist.spec_value_id_arr) {
				selectedSku = exist.spec_value_id_arr;
			}
		}
		if (!selectedSku) {
			selectedSku = (this.sku[0] && this.sku[0].spec_value_id_arr) || [];
		}
		selectedSku = [...selectedSku];

		return {
			img: OSS.ICON_O1,
			selectedSku, // 当前的规格值数组
			visible: false,
			num: this.quantity || 1 // 购买量
		};
	},
	computed: {
		limitQuantity() {
			if (this.limitNum <= -1) {
				return (+(this.curSku && this.curSku.activity_stock) || 0);
			} else {
				return Math.min(this.limitNum, +(this.curSku && this.curSku.activity_stock) || 0);
			}

		},
		parsedSku() {
			const data = this.sku;
			return this.parseSku(data);
		},
		curSku() {
			if (this.skuNum == 0) return this.sku[0];
			const skuStr = this.selectedSku.join('-');
			const cur = this.sku.find(item => item.spec_value_id_arr.join('-') === skuStr);
			return cur;

		}
	},
	mounted() {
		this.visible = true;
		
	},
	methods: {
		handleOk() {
			if (!this.curSku) return this.$Toast.info('请选择规格');
			if (!this.curSku.activity_stock) return this.$Toast.info('此规格已售罄，请重新选择');
			if (this.curSku.activity_stock < this.num) return this.$Toast.info('库存不足，当前库存剩余' + this.curSku.activity_stock);
			this.visible = false;
			this.$emit('sure', { sku_sn: this.curSku.sku_sn, quantity: this.num });
		},
		handleSkuClick(item, deep) {
			
			this.selectedSku[deep] = item.value;
			
			if (this.sku[0] && item.children && item.children.length) {
				let children = item.children;
				for (let i = deep + 1; i < this.sku[0].spec_value_id_arr.length - deep - 1; i++) {
					if (this.selectedSku[i]) {
						let cur = children.find(it => it.value === this.selectedSku[i]);
						if (cur.valid === false) {
							const firstValid = children.find(it => it.valid == true);
							this.selectedSku[i] = firstValid.value;
							cur = firstValid;
						}
						children = cur.children;

					}
				}
			}
			this.selectedSku = [...this.selectedSku];
			

			
			
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	
		
		parseSku(skus) {
			if (this.skuNum == 0) return [];
			 skus = skus.map(sku => ({
				valid: !!sku.activity_stock,
				sku_sn: sku.sku_sn,
				children: sku.spec_value_id_arr.map((item, index) => ({
					label: sku.spec_value_names[index],
					value: item,
					spec_id: sku.spec_id_arr[index],
					spec_name: sku.spec_names[index]
				}))
			}));
			const result = [
			];

			skus.forEach(item => {
				let targetArr = result;
				
				item.children.forEach(it => {
					let exist = targetArr.find(i => i.value === it.value);
					if (exist) {
						exist.valid = exist.valid || item.valid;
						
					} else {
						exist = {
							label: it.label,
							value: it.value,
							valid: item.valid,
							spec_id: it.spec_id,
							spec_name: it.spec_name,
							children: []
						};
						targetArr.push(exist);
					}
					targetArr = exist.children;
				});
			});
			return result;
			
		}
	}
};
export default com;
export const SelectSku = new Portal(com, {});
</script>
<style lang="scss">
.v-product-select-sku {
	._sku-item {
		color: #999;
		background: #f2f2f2;
		&._active {
			color: rgb(241, 66, 95);
			background: lightpink;

		}
	}
 

}
</style>