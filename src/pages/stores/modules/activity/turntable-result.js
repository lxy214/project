const initialState = {
	data: ''
};

const mutations = {
	ACTIVITY_TURNTABLE_RESULT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const activityTurntableResult = {
	state: { ...initialState },
	mutations,
};
