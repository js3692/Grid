app.controller('GameCtrl', function($scope, FirebaseFactory, gridId, key){
    $scope.grid = FirebaseFactory.getConnection(key);
    console.log('$scope.grid', $scope.grid)
    $scope.gridGame = FirebaseFactory.getConnection(key + '/game'); 
}); 