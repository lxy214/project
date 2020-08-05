
import { initTree } from '@utils/utils';
import { createService } from './utils';

const service = {
	// 手机国际区号
	...createService({
		key: "mobilePrefix",
		cache: true,
		url: '_COMMON_MOBILE_PREFIX_GET',
	}),
	// // 全国所有的地址
	// ...createService({
	// 	key: "region",
	// 	url: '_COMMON_PUBLIC_ALL_GET',
	// 	cache: true,
	// 	parser: (data) => initTree(data, { labelKey: 'region_name', valueKey: 'national_code', childrenKey: 'children' })

	// }),
	...createService({
		key: "region",
		cache: true,
		url: '_COMMON_REGION_GET',
		parser: (data) => {
			let extraCity = ['北京', '天津', '上海', '重庆'];
			let extraProvince = ['台湾'];
			data.forEach(v => {
				if (extraCity.includes(v.region_name)) {
					v.region_name += '市';
				}
				if (extraProvince.includes(v.region_name)) {
					v.region_name += '省';
				}
			});
			return initTree(data, { labelKey: 'region_name', valueKey: 'national_code', childrenKey: 'children' });
		}

	}),


};
export default service;
