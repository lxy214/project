import { pick } from 'lodash';

import Page from '../sorts/page.vue';
import Rtf from './rtf.vue';

const Decorate = {
	'xls-page': Page,
	'xls-rtf': Rtf
};

export default {
	getComponents: (list) => {
		return pick(Decorate, list || Object.keys(Decorate));
	}
};
