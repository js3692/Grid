app.factory('BeforeGameFactory', function ($http, $q) {

	var baseUrl = '/api/grid/before/';
	var BeforeGameFactory = {};
	var cachedGrid;

	function toData (response) {
		return response.data;
	}

	function updateCachedGrid (grid) {
		cachedGrid = grid;
		return grid;
	}

	function organizePlayersForStart (users) {
		return users.map(user => { return { user: user, color: user.color }; });
	}

	BeforeGameFactory.newGame = function (gameSettings) {
		return $http.post('/api/grid', gameSettings)
			.then(toData)
			.then(updateCachedGrid);
	};

	BeforeGameFactory.joinGame = function (gridId) {
	return $http.post(baseUrl + gridId + '/join')
		.then(toData)
		.then(updateCachedGrid);
	};

	BeforeGameFactory.leaveGame = function (gridId) {
		return $http.post(baseUrl + gridId + '/leave')
			.then(toData);
	};

	BeforeGameFactory.start = function (gridId, users) {
		return $http.put(baseUrl + gridId + '/start', organizePlayersForStart(users))
			.then(toData);
	};

	BeforeGameFactory.fetchOne = function (gridId) {
		return $http.get(baseUrl + gridId)
			.then(toData);
	};

	BeforeGameFactory.getCachedGrid = function (id) {
		if(id && !cachedGrid) return BeforeGameFactory.fetchOne(id);
		return $q.resolve(cachedGrid);
	};

	BeforeGameFactory.changeColor = function (id, userId, color) {
		return $http.put(baseUrl + id + '/changeColor', { userId: userId, color: color })
			.then(toData);
	};
	
	return BeforeGameFactory;
	
});