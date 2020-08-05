const initialState = {
	data: ''
};

const mutations = {
	ORDER_TRANSPORT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const orderTransport = {
	state: { ...initialState },
	mutations,
};
