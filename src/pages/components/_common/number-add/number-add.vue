<template>
	<div class="c-number-add g-flex g-ai-c">
		<span class="g-pd-8" @click="handleDec">
			<div style="border:1px solid #999;width:10px " />
		</span>
		<span class="g-col g-tc">
			{{ num }}
		</span>
		<span class="g-pd-8" @click="handleAdd"><vc-icon type="plus" /></span>
	</div>
</template>
<script>
export default {
	name: 'xls-number-add',
	components: {
	},
	props: {
		value: Number,
		min: {
			type: Number,
			default: 1
		},
		max: {
			type: Number,
			default: 999
		}
	},
	data() {
		return {
			num: parseInt(+this.value || 0, 10)
		};
	},
	watch: {
		value(val) {
			this.num = val;
		}
	},
	methods: {
		handleAdd() {
			if (this.num < this.max) {
				this.num++;
				this.$emit('input', this.num);
				this.$emit('change', this.num);
			} else {
				this.$emit('over-max', this.num);
			}

		},
		handleDec() {
			if (this.num > this.min) {
				this.num--;
				this.$emit('input', this.num);
				this.$emit('change', this.num);
			} else {
				this.$emit('lower-min', this.num);
			}
			
		}
	}
};
</script>
<style lang="scss">
.c-number-add {
	min-width: 90px;
	background: #f5f5f5

}
</style>