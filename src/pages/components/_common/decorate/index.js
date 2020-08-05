import Drags from './drags/index';
import Sorts from './sorts/index';

const Decorate = {};
Decorate.getComponents = (list, opts = {}) => {

	if (!(list instanceof Array)) {
		opts = list || {};
		list = undefined;
	}

	const { mode } = opts;

	return mode === 'sortable'
		? Sorts.getComponents(list, opts)
		: Drags.getComponents(list, opts);
};
export default Decorate;