app.directive('resourcePanel', function (SliderFactory, $uibModal) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/resourcePanel/resourcePanel.html',
        scope: {
            resources: '='
        },
        link: function (scope, elem, attrs) {
            scope.resourceColors = {
                coal: '#C8824D',
                oil: 'black',
                trash: '#A8A818',
                nuke: 'red'
            };

            scope.open = SliderFactory.slideOut.bind(null, 'resource');

            scope.buyResources = function (plant) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'js/common/directives/resourceModal/resourceModal.html',
                    controller: 'ResourceModalCtrl',
                    size: 'sm',
                    resolve: {
                        resources: function () {
                            return scope.resources;
                        },
                        resourceColors: function () {
                            return scope.resourceColors;
                        }

                    }
                });
            };
        }
    }
});