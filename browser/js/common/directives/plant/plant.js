app.directive('plant', function(){
    return {
        restrict: 'E',
        templateUrl: "js/common/directives/plant/plant.html",
        scope: {
            plant:'='
        },
        link: function(scope, elem, attrs){ 
        }
    }
}); 