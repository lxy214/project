import Decorate from '@common/decorate';
import FooterBt from './footer-bt';

const components = {
	'xls-footer-button': FooterBt,
	...Decorate.getComponents({ mode: 'sortable' })
};
const regex = new RegExp(`^(${Object.keys(components).map((i) => i.replace(/xls-/, '')).join('|')})$`);
export default {
	components,
	data() {
		return {
			regex
		};
	}
};
