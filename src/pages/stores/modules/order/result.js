const initialState = {
	data: ''
};

const mutations = {
	ORDER_RESULT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const orderResult = {
	state: { ...initialState },
	mutations,
};
