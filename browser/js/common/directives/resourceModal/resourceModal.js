app.controller('ResourceModalCtrl', function($scope, $uibModalInstance, resources, resourceColors){
    $scope.resources = resources;
    $scope.resourceColors = resourceColors;
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})