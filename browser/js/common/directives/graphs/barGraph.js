app.directive('bargraph', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div class="barGraph"></div>',
		scope: {
			data: '='
		},
		link: function(scope, element, attrs) {

			var svgWidth = 420,
				svgHeight = 420;

			var svg = d3.select('.barGraph')
				.append('svg')
				.attr('class', 'barGraph')
				.attr('width', svgWidth)
				.attr('height', svgHeight);


					
		}
	}
})