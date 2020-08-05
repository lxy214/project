const initialState = {
	data: ''
};

const mutations = {
	ACTIVITY_TEST_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const activityTest = {
	state: { ...initialState },
	mutations,
};
