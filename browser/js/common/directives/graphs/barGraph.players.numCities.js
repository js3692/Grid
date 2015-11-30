app.directive('bargraph', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div class="barGraph"></div>',
		scope: {
			data: '='
		},
		link: function(scope, element, attrs) {

			var margin = {top: 20, right: 20, bottom: 30, left: 40},
				width = 960 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			var x = d3.scale.ordinal()
				.rangeRoundBands([0, width], .1);

			var y = d3.scale.linear()
				.range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient('bottom');

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient('left')
				// .ticks(10, "%");

			var svg = d3.select('.barGraph')
				.append('svg')
				.attr('class', 'barGraph')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");




			scope.$watch('data', function(newData, oldData) {
				// var players = newData.turnOrder;

				// Hard-coded dataset for trial/viewing purposes
				var players = [
					{numCities: 8, user: {username: 'person1'}},
					{numCities: 5, user: {username: 'person2'}},
					{numCities: 7, user: {username: 'person3'}},
					{numCities: 2, user: {username: 'person4'}}
				];

				if(players) {

					console.log('players', players)

					console.log('players arr', players.map(function(d) { return d.user.username }))

					x.domain(players.map(function(d) { return d.user.username }));
					y.domain([0, d3.max(players, function(d) { return d.numCities })]);

					svg.append('g')
						.attr('class', 'x axis')
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

					svg.append('g')
						.attr('class', 'y axis')
						.call(yAxis)
						.append('text')
						.attr('transform', 'rotate(-90)')
						.attr('y', 6)
						.attr('dy', '.71em')
						.style('text-anchor', 'end')
						.text('# of Cities');

					svg.selectAll('.bar')
						.data(players)
						.enter()
						.append('rect')
						.attr('class', 'bar')
						.attr('x', function(d) { return x(d.user.username); })
						.attr('width', x.rangeBand())
						.attr('y', function(d) { return y(d.numCities); })
						.attr('height', function(d) { return height - y(d.numCities); });

				}
			}, true);


					
		}
	}
})