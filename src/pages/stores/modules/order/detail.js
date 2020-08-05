const initialState = {
	data: ''
};

const mutations = {
	ORDER_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const orderDetail = {
	state: { ...initialState },
	mutations,
};
