var _ = require('lodash');

module.exports = function totalConnectionCost(citiesToAdd, network, cities, connections) {
	var networkCopy = network.slice();
	var citiesToAddCopy = citiesToAdd.slice();
	var cost = 0;
	while(citiesToAddCopy.length) {
		var distances = citiesToAddCopy.map(function(city) {
			return cheapestDistanceTo(city, networkCopy, cities, connections)
		});
		var cheapest = Math.min.apply(null, distances);
		var cheapestIndex = distances.indexOf(cheapest);
		cost += cheapest;
		networkCopy.push(citiesToAddCopy.splice(cheapestIndex,1)[0]);
	}
	return cost;
}

function cheapestDistanceTo(destination, network, cities, connections) {
	if(!network.length) return 0;

	var data = cities.map(function(city) {
		return {
			city: city,
			distance: containsCity(network, city) ? 0 : Infinity,
			visited: false
		}
	})

	var currentNode = _.find(data, function(node) {
		return !node.distance;
	})

	while(!getNode(destination, data).visited) {
		var connectionsToCurrent = connectionsTo(currentNode.city, connections);
		unvisitedNeighbors(currentNode, data, connectionsToCurrent).forEach(function (unvisitedNode) {
			var connectionCost = directConnection(currentNode, unvisitedNode, connections).distance;
			var tempDistance = currentNode.distance + connectionCost;
			if (tempDistance < unvisitedNode.distance) unvisitedNode.distance = tempDistance;
		})
		currentNode.visited = true;
		currentNode = getNewCurrent(data);
	}
	return getNode(destination, data).distance;
}

function containsCity(cities, city) {
	return !!_.find(cities, function(c) {
		return c._id.equals(city._id)
	})
}

function connectionsTo(city, connections) {
	return connections.filter(function (connection) {
		return containsCity(connection.cities, city);
	})
}

function unvisitedNeighbors(node, data, connectionsToNode) {
	var neighboringCities = connectionsToNode.map(function (connection) {
		return connection.cities.filter(function (city) {
			return !city._id.equals(node.city._id);
		})[0];
	})
	return data.filter(function (node) {
		return containsCity(neighboringCities, node.city) && !node.visited;
	})
}

function directConnection(node1, node2, connections) {
	return connectionsTo(node1.city, connections).filter(function (connection) {
		return containsCity(connection.cities, node2.city);
	})[0]
}

function getNode(city, data) {
	return _.find(data, function(node) {
		return node.city._id.equals(city._id);
	})
}

function getNewCurrent(data) {
	var unvisitedNodes = data.filter(function (node) {
		return !node.visited;
	})
	if (!unvisitedNodes) return;
	else {
		var minDist = Infinity;
		var newCurrent;
		unvisitedNodes.forEach(function (node) {
			if (node.distance < minDist) {
				newCurrent = node;
				minDist = node.distance;
			}
		})
		return newCurrent;
	}
}

