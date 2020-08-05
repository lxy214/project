const initialState = {
	data: ''
};

const mutations = {
	REWARD_DETAIL_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const rewardDetail = {
	state: { ...initialState },
	mutations,
};
