const initialState = {
	data: ''
};

const mutations = {
	POSTER_MAIN_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const posterMain = {
	state: { ...initialState },
	mutations,
};
