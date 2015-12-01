app.directive('zoomMap', function($parse) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div class="map"></div>',
		scope: {
			data: '='
		},
		link: function(scope, element, attrs) {

			var width = Math.max(960, window.innerWidth),
			    height = Math.max(500, window.innerHeight);

			var tile = d3.geo.tile()
			    .size([width, height]);

			var projection = d3.geo.mercator()
			    .scale((1 << 12) / 2 / Math.PI)
			    .translate([width / 2, height / 2]);

			var center = projection([-100, 40]);

			var zoom = d3.behavior.zoom()
			    .scale(projection.scale() * 2 * Math.PI)
			    .scaleExtent([1 << 11, 1 << 14])
			    .translate([width - center[0], height - center[1]])
			    .on("zoom", zoomed);

		    const initZoomScale = zoom.scale();


			var cityPath = d3.geo.path()
			    .pointRadius(zoom.scale()/800)
			    .projection(projection);

		    var connectionPath = d3.geo.path()
		    	.projection(projection);

	    	var distancePath = d3.geo.path()
			    .pointRadius(zoom.scale()/1600)
			    .projection(projection);

			
			var svg = d3.select(".map").append("svg")
			    .attr("width", width)
			    .attr("height", height);


			var raster = svg.append("g")
				.attr('class', 'Map Tiles');


			var connectionVector = svg.append("path")
				.attr('class', 'Connections')
				.attr('fill', 'none')
				.attr('stroke', 'grey');

			var connectionDists = svg.append("g")
				.attr('class', 'Connection Distances');

			var connectionDistVector;

			var citiesCollection = svg.append("g")
				.attr('class', 'Cities');

			var cityVector;



			scope.$watch('data', function(newData, oldData) {
				var cities = newData.cities,
					connections = newData.connections;

				if(cities && connections) {
					var revisedCities = cities.map(function(city) {
						return cityType(city);
					});
					var revisedConnections = connections.map(function(connection) {
						return connectionType(connection);
					});
					var revisedDistMarkers = connections.map(function(connection) {
						return connectionDistType(connection);
					});

					svg.call(zoom);

					cityVector = citiesCollection.selectAll("path")
						.data(revisedCities)
						.enter()
						.append('path');

					connectionVector.datum({type: "FeatureCollection", features: revisedConnections});

					connectionDistVector = connectionDists.selectAll("path")
						.data(revisedDistMarkers)
						.enter()
						.append('path')
						.attr('id', function(d,i) { return "path_" + i; });

					connectionDists.selectAll('text')
						.data(revisedDistMarkers)
						.enter()
						.append('text')
						.append('textPath')
						.attr("xlink:href", function (d,i) { return "#path_" + i; })
						.attr('spacing', 'exact')
			            .text(function (d) { return d.properties.distance; })
			            .attr("text-anchor", "middle")
						.attr("font-family", "sans-serif")
						.attr("font-size", "15px")
						.attr("fill", "black");

					zoomed();
				}


			}, true);


			function cityType(d) {
				return {
					type: 'Feature',
					properties: {
						name: d.name,
						region: d.region
					},
					geometry: {
						type: 'Point',
						coordinates: [d.location[1], d.location[0]]
					}
				}
			}

			function connectionDistType(d) {
				var firstLon = d.cities[0].location[1],
					firstLat = d.cities[0].location[0],
					secondLon = d.cities[1].location[1],
					secondLat = d.cities[1].location[0];

				var coordinates = [ (firstLon+secondLon)/2, (firstLat+secondLat)/2 ];

				return {
					type: 'Feature',
					properties: {
						distance: d.distance,
						cities: d.cities,
						cityNames: d.cityNames
					},
					geometry: {
						type: 'Point',
						coordinates: coordinates
					}
				}
			}

			function connectionType(d) {
				var firstLon = d.cities[0].location[1],
					firstLat = d.cities[0].location[0],
					secondLon = d.cities[1].location[1],
					secondLat = d.cities[1].location[0];

				var coordinates = [
					[firstLon, firstLat],
					[secondLon, secondLat],
				];

				return {
					type: 'Feature',
					properties: {
						distance: d.distance,
						cities: d.cities,
						cityNames: d.cityNames
					},
					geometry: {
						type: 'LineString',
						coordinates: coordinates
					}
				}
			}

			function zoomed() {
				var tiles = tile
			    	.scale(zoom.scale())
			    	.translate(zoom.translate())
			    	();

				projection
			    	.scale(zoom.scale() / 2 / Math.PI)
			    	.translate(zoom.translate());
		    	

		    	cityVector
		    		.attr('name', function(d) { return d.properties.name })
		    		.attr('region', function(d) { return d.properties.region })
					.attr('d', cityPath)
					.on('click', function(d,i) {
						console.log("You've clicked " + d.properties.name)
					});

		    	connectionVector
			    	.attr('d', connectionPath);

		    	connectionDistVector
		    		.attr('distance', function(d) { return d.properties.distance })
		    		.attr('d', distancePath);


		    	cityPath
		    		.pointRadius(zoom.scale()/800);

	    		distancePath
	    			.pointRadius(zoom.scale()/1600);


				var image = raster
			    	.attr("transform", "scale(" + tiles.scale + ")translate(" + tiles.translate + ")")
			  		.selectAll("image")
			    	.data(tiles, function(d) { return d; });

				image.exit()
			    	.remove();

				image.enter().append("image")
			    	.attr("xlink:href", function(d) {
			      		return "http://" + ["a", "b", "c"][Math.random() * 3 | 0] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
			    	.attr("width", 1)
			    	.attr("height", 1)
			    	.attr("x", function(d) { return d[0]; })
			    	.attr("y", function(d) { return d[1]; });
			}

					
		}
	}
})