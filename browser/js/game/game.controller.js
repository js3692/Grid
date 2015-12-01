app.controller('GameCtrl', function($scope, FirebaseFactory, thePlayer, gridId, key){
    $scope.me = thePlayer;
    $scope.key = key;
    $scope.grid = FirebaseFactory.getConnection(key);
    $scope.gridGame = FirebaseFactory.getConnection(key + '/game');
}); 