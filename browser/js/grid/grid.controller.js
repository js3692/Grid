app.controller('GridCtrl', function ($scope, $state, thePlayer, BeforeGameFactory, FirebaseFactory, gridId, key) {
    
    $scope.grid = FirebaseFactory.getConnection(key);
    
	$scope.me = thePlayer;
    $scope.key = key;
    
    $scope.selected = thePlayer.color;
    $scope.colors = ['purple', 'yellow', 'green', 'blue', 'red', 'black'];
    $scope.changeColor = BeforeGameFactory.changeColor.bind(null, gridId, thePlayer._id)
    $scope.colorPicked = function(color){
        var users = $scope.grid.users || $scope.me;
        
        for(let i = 0, len = users.length; i < len; i++){
            if(color === users[i].color) return .4;
        }
        
        return false;
    };
    
    $scope.$watch('grid.game', function(game){
        if(game) $state.go('game', { id: gridId, key: key });
    });
   
	$scope.startGame = function() {
		BeforeGameFactory
            .start($scope.grid.id, $scope.grid.users)
            .then(function(updatedGrid){
                $state.go('game', { id: gridId, key: key });
            })
	}; 

	$scope.leaveGame = function() {
		BeforeGameFactory.leaveGame($scope.grid.id)
		.then(function() {
			$state.go('home');
		})
	};
})