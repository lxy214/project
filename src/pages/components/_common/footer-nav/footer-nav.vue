<template>
	<vc-portal-view>
		<div style="height: 68px" />
		<template #content>
			<div
				class="g-flex g-bg-white g-tc g-reset g-pd-t-8 g-pd-b-5 g-fixed c-footer-nav"
				@click="handleRemoveSelection"
			>
				<router-link
					v-for="item in dataSource"
					:key="item.url"
					:to="item.url"
					class="g-col"
					tag="div"
				>
					<div>
						<div style="margin-bottom: 4px;">
							<vc-img :src="`${item.img[0]}!4-4`" style="width: 32px; height: 32px;" />
						</div>
						<div class="_name">
							{{ item.name }}
						</div>
					</div>
				</router-link>
			</div>
		</template>
	</vc-portal-view>
</template>

<script>
import { Clipboard } from '@wya/vc';

export default {
	name: 'xls-footer-nav',
	props: {
		dataSource: Array
	},
	data() {
		return {
		};
	},
	mounted() {
	},
	methods: {
		handleRemoveSelection() {
			Clipboard.clearSelection();
		}
	}
};
</script>

<style lang="scss">
.c-footer-nav {
	bottom: 0;
	left: 0;
	right: 0;
	border-top: 1px solid #edeef0;
	z-index: 999;
	._name {
		color: #584F60;
	}
}
</style>
