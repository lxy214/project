const initialState = {
	data: ''
};

const mutations = {
	PRODUCT_MAIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const productMain = {
	state: { ...initialState },
	mutations,
};
