import { initScroll } from '@utils/utils';

const initialState = {
	listInfo: {
		'1': {
			...initScroll
		},
		'0': {
			...initScroll
		},
	},
	current: {}
};

const mutations = {
	INVITE_RANKING_PERSONAL_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
		state.current = data.current;
	},
	INVITE_RANKING_PERSONAL_LIST_GET_REFRESH(state, { type, page }) {
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
		state.current = initialState.current;
	},
	INVITE_RANKING_GROUP_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
		state.current = data.current;
	},
	INVITE_RANKING_GROUP_LIST_GET_REFRESH(state, { type, page }) {
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
		state.current = initialState.current;
	},
	INVITE_RANKING_GROUP_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
		state.current = initialState.current;
	},
	INVITE_RANKING_PERSONAL_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
		state.current = initialState.current;
	},
	INVITE_RANKING_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
		state.current = initialState.current;
	},
};

export const inviteRanking = {
	state: { ...initialState },
	mutations,
};
