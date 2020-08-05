import { initScroll } from '@utils/utils';

const initialState = {
	listInfo: {
		'1': {
			...initScroll
		},
		'2': {
			...initScroll
		},
		'3': {
			...initScroll
		},
	}
};

const mutations = {
	INVITE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	INVITE_DIRECT_RELATION_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	INVITE_COLLECT_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	INVITE_RELATION_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	INVITE_LIST_GET_REFRESH(state, { type, page }) {
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
	INVITE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	INVITE_DIRECT_RELATION_LIST_GET_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	INVITE_COLLECT_LIST_GET_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	INVITE_RELATION_LIST_GET_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	INVITE_LIST_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	}
};

export const inviteList = {
	state: { ...initialState },
	mutations,
};