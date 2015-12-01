app.directive('bars', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="chart"></div>',
        scope: {
            data: '=',
            resourceColors: '='
        },
        link: function (scope, element, attrs) {

            scope.$watch('data', function (resources) {
                var data = [];

                for (var key in resources) {
                    data.push({ value: resources[key], type: key, color: scope.resourceColors[key]});
                }
                var chart = d3.select('#chart')
                    .append("div").attr("class", "chart")
                    .selectAll('div')
                    .data(data).enter()
                    .append("div")
                    .transition().ease("elastic")
                    .style("width", function (d) {
                        return (d.value/24)*94 + "%";
                    })
                    .style("background-color", function(d){
                        return d.color;
                    })
                    .style("box-sizing", function(){
                        return "border-box";
                    })
                    .text(function (d) {
                        return d.type + ': ' + d.value;
                    });
            })
        }
    };
});