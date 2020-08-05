<template>
	<div class="g-flex g-fd-c">
		<xls-red-envelopes class="g-col" />
	</div>
</template>

<script>
import RedEnvelopes from "../../_common/red-envelopes/red-envelopes";

export default {
	name: 'xls-content',
	components: {
		'xls-red-envelopes': RedEnvelopes
	}
};
</script>

<style lang="scss">
</style>