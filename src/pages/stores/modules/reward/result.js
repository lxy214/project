const initialState = {
	data: ''
};

const mutations = {
	REWARD_RESULT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const rewardResult = {
	state: { ...initialState },
	mutations,
};
