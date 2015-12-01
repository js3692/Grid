app.config(function ($stateProvider) {
	$stateProvider.state('grid', {
		url: '/grid/:id/:key',
		controller: 'GridCtrl',
		templateUrl: 'js/grid/grid.html',
		resolve: {
			gridId: function ($stateParams) {
                return $stateParams.id;
            },
      key: function($stateParams) {
                return $stateParams.key;  
            },
			thePlayer: function(AuthService) {
				var player = AuthService.getLoggedInUser();
                player.color = null;
                return player;
			}
		},
    data: {
      authenticate: true
    }
	});
});