app.directive('plantPanel', function(SliderFactory, $uibModal){
    return {
        restrict: "E",
        templateUrl: "js/common/directives/plantPanel/plantPanel.html",
        scope: {
            plantMarket: '='
        },
        link: function(scope, elem, attrs){   
            scope.open = SliderFactory.slideOut.bind(null, 'plant');
            scope.firstFour = function(index){
                if(index < 4) return 1;
                return .5;
            } 
            
            scope.bidFor = function (plant) {
              var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'js/common/directives/bidModal/bidModal.html',
                    controller: 'BidModalCtrl',
                    size: 'sm',
                    resolve: {
                      plant: function () {
                        return plant;
                      }
                    }
                });   
            };
        }
    }
})