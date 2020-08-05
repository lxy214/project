import { initScroll } from '@utils/utils';

const initialState = {
	listInfo: {
		'0': {
			...initScroll
		},
		'1': {
			...initScroll
		},
		'2': {
			...initScroll
		},
		'3': {
			...initScroll
		},
	},
	tip: [],
};

const mutations = {
	ORDER_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				...data.page,
				data: [
					...state.listInfo[type].data,
					...data.list
				]
			}
		};
		state.tip = data.tip;
	},
	ORDER_LIST_GET_REFRESH(state, { data, param: { type, page } }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...state.listInfo[type],
				...data.page,
				data: [
					...data.list
				]
			}
		};
		state.tip = data.tip;
	},
	ORDER_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
		state.tip = initialState.tips;
	},
	ORDER_LIST_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
		state.tip = initialState.tip;
	},
};

export const orderList = {
	state: { ...initialState },
	mutations,
};
