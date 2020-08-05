const initialState = {
	data: ''
};

const mutations = {
	REWARD_CASH_ACCOUNT_GET_SUCCESS(state, { data, param }) {
		state.data = {
			...data
		};
	}
};

export const rewardCashAccount = {
	state: { ...initialState },
	mutations,
};
