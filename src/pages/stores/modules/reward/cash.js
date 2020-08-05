const initialState = {
	data: ''
};

const mutations = {
	REWARD_CASH_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const rewardCash = {
	state: { ...initialState },
	mutations,
};
