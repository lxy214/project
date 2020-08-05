const api = {
	/**
	 * 请注释模块内容
	 */
	INVITE_LIST_GET: '',
	INVITE_DIRECT_RELATION_LIST_GET: '/user/user/direct-relation.json', // 亲密粉丝
	INVITE_RELATION_LIST_GET: '/user/user/relation.json', // 所有粉丝
	INVITE_COLLECT_LIST_GET: '/user/user/collect-list.json', // 收藏列表
	_INVITE_COLLECT_USER_IDS_LIST_GET: '/user/user/collect-user-ids.json', // 所有收藏的用户ID
	_INVITE_USER_RELATION_STATISTICS_GET: '/user/user/relation-statistics.json', // 头部统计
	_INVITE_USER_RELATION_DETAIL_GET: '/user/user/relation-detail.json', // 所有粉丝详情
	_INVITE_USER_COLLECT_POST: '/user/user/collect.json', // 添加收藏
	_INVITE_USER_SEARCH_ACTIVITY_GET: '/user/user/search-activity.json', // 搜索展示的活动信息,
	INVITE_RANKING_GET: '',
	INVITE_RANKING_LIST_GET: '/test',
	INVITE_RANKING_PERSONAL_LIST_GET: '/user/ranking/personal-rank.json', // 个人粉丝排行榜
	INVITE_RANKING_GROUP_LIST_GET: '/user/ranking/group-rank.json', // 团队粉丝排行榜
	_INVITE_RANKING_USER_IDENTITY_GET: '/user/ranking/rank-info.json', // 用户权限获取
};

export default api;
