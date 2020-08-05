const initialState = {
	data: ''
};

const mutations = {
	ORDER_MAIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const orderMain = {
	state: { ...initialState },
	mutations,
};
