const initialState = {
	data: ''
};

const mutations = {
	ACTIVITY_TURNTABLE_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const activityTurntable = {
	state: { ...initialState },
	mutations,
};
