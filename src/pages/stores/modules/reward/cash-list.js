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
		}
	}
};

const mutations = {
	REWARD_CASH_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	},
	REWARD_CASH_LIST_GET_REFRESH(state, { type, page }) {
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
	},
	REWARD_CASH_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	REWARD_CASH_LIST_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	}
};

export const rewardCashList = {
	state: { ...initialState },
	mutations,
};