<template>
	<div
		v-if="newList.length"
		:class="`is-layout-${layout}`"
		class="vm-basic-slide-viewer"
	>
		<div
			v-if="layout === 1"
			:style="`padding: ${padding_type === 1 ? '0px' : '8px'}`"
			class="vm-basic-slide-viewer__content"
		>
			<vcm-carousel
				:height="slideHeight"
				:t="interval"
				:indicator="false"
				:dots="newList.length > 1"
				style="width: 100%;"
			>
				<vcm-carousel-item
					v-for="(item, index) in newList"
					:key="index"
				>
					<xls-link
						:to="item.url"
						:style="[{
							'background-image': `url('${item.img[0]}!1-0')`,
							'border-radius': radius_type === 1 ? '' : '8px',
						}]"
						:enhancer="specialActionIds.includes(item.id)"
						:primary-key="item.id"
						class="vm-basic-slide-viewer__item"
					>
						<span
							v-if="item.name"
							class="vm-basic-slide-viewer__title"
						>
							{{ item.name }}
						</span>
					</xls-link>
				</vcm-carousel-item>
			</vcm-carousel>
		</div>
		<div
			v-if="layout === 2"
			:style="`padding: 0px ${pd_lr}px`"
			class="vm-basic-slide-viewer__content"
		>
			<xls-link
				v-for="(item, index) in newList"
				:key="index"
				:style="[{
					'border-radius': radius_type === 1 ? '' : '8px',
					'margin-bottom': `${margin}px`,
					'padding': newList.find(item => item.img.length !== 0) ? '' : '20px 0'
				}]"
				:enhancer="specialActionIds.includes(item.id)"
				:primary-key="item.id"
				:to="item.url"
				class="vm-basic-slide-viewer__item"
			>
				<vcm-img
					:src="item.img[0] ? (item.img[0] + '!1-0') : ''"
					style="width: 100%; display: block;"
				/>
				<div
					v-if="item.name"
					class="vm-basic-slide-viewer__title"
				>
					{{ item.name }}
				</div>
			</xls-link>
		</div>
		<div
			v-if="layout === 3"
			:style="`padding: 0px ${pd_lr}px`"
			class="vm-basic-slide-viewer__content"
		>
			<xls-link
				v-for="(item, index) in newList"
				:key="index"
				:style="[{
					'background-image': `url('${item.img[0]}!1-0')`,
					'border-radius': radius_type === 1 ? '' : '8px',
					'margin-right': `${margin}px`
				}]"
				:enhancer="specialActionIds.includes(item.id)"
				:primary-key="item.id"
				:to="item.url"
				class="vm-basic-slide-viewer__item"
			>
				<div
					v-if="item.name"
					class="vm-basic-slide-viewer__title"
				>
					{{ item.name }}
				</div>
			</xls-link>
		</div>
	</div>
</template>

<script>
/* eslint-disable vue/prop-name-casing */
import { Resize } from '@wya/vc/lib/utils/resize';
import { debounce } from 'lodash';

export default {
	name: 'vm-basic-slide-viewer',
	props: {
		layout: Number, // 布局/样式, 从左到右1，2，3...
		type: Number, // 1、轮播 2、上下 3、左右
		interval: Number, // 轮播时间
		radius_type: Number, // 1直角 2圆角
		padding_type: Number, // 1填充 2留白
		margin: Number, // 图片间距
		pd_lr: Number, // 左右页面填充/边距
		list: {
			type: Array,
			default: () => []
		},
		vm: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			slideHeight: 200,
			specialActionIds: [5]
		};
	},
	computed: {
		newList() {
			return this.list.filter(item => item.show);
		}
	},
	watch: {
		list: {
			handler(v) {
				let arr = v.filter(item => item.show);
				if (arr.length === 0 || arr.filter(item => item.img.length > 0).length === 0) {
					this.slideHeight = 200;
					return;
				}
				this.handleUpdateHeight();
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {
		let isEdit = this.$route.query.isEdit == 'false';
		let el = document.querySelector(isEdit ? '.vm-tools-preview' : '.vm-frame-sortable');
		el && Resize.on(el, this.handleUpdateHeight);
	},
	beforeDestroy() {
		let isEdit = this.$route.query.isEdit == 'false';
		let el = document.querySelector(isEdit ? '.vm-tools-preview' : '.vm-frame-sortable');
		el && Resize.off(el, this.handleUpdateHeight);
	},
	methods: {
		handleUpdateHeight() {
			if (this.list[0]) {
				this.$nextTick(() => {
					let img = new Image();
					img.src = this.list[0].img[0] + '!0-0';
					let el = document.querySelector('.vm-basic-slide-viewer');
					let wrapW = el ? el.clientWidth : 375;
					let screenW = this.vm.type ? wrapW : this.$global.width;
					img.onload = () => {
						this.slideHeight = ((screenW / img.naturalWidth) * img.naturalHeight).toFixed(1);
					};
				});
			}
		}
	}
};
</script>

<style lang="scss">
@import "~@wya/sass/lib/mixins/bem.scss";
$block: vm-basic-slide-viewer;

@include block($block) {
	background: #fff;
	@include when(layout-1) {
		@include element(item) {
			display: block;
			width: 100%;
			height: 100%;
			background-position: center;
			background-repeat: no-repeat;
			background-size: contain;
			position: relative;
			overflow: hidden;
			@include element(title) {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 28px;
				background:rgba(0, 0, 0, 0.5);
				color: #FFFFFF;
				font-size: 14px;
				line-height: 28px;
				padding-left: 12px;
			}
		}
	}
	@include when(layout-2) {
		@include element(item) {
			display: block;
			width: 100%;
			position: relative;
			overflow: hidden;
			&:last-child {
				margin-bottom: 0px;
			}
			@include element(title) {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 28px;
				background:rgba(0, 0, 0, 0.5);
				color: #FFFFFF;
				font-size: 14px;
				line-height: 28px;
				padding-left: 12px;
			}
		}
	}
	@include when(layout-3) {
		@include element(content) {
			white-space: nowrap;
			overflow-x: auto;
			font-size: 0;
			@include element(item) {
				display: inline-block;
				width: 150px;
				height: 100px;
				background-position: center;
				background-repeat: no-repeat;
				background-size: cover;
				position: relative;
				overflow: hidden;
				&:last-child {
					margin-right: 0px;
				}
				@include element(title) {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 28px;
					background:rgba(0, 0, 0, 0.5);
					color: #FFFFFF;
					font-size: 14px;
					line-height: 28px;
					padding-left: 12px;
				}
			}
		}
	}
}
</style>
