import login from './login/root';
import layout from './layout/root';
import reward from './reward/root';
import product from './product/root';
import poster from './poster/root';
import order from './order/root';
import invite from './invite/root';
import activity from './activity/root';

export default {
	...layout,
	...login,
	...reward,
	...product,
	...poster,
	...order,
	...invite,
	...activity
};
