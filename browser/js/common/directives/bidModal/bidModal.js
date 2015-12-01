app.controller('BidModalCtrl', function($scope, $uibModalInstance, plant){
    $scope.plant = plant;
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})