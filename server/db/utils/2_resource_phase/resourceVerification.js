module.exports = {

	// wishlist example: {coal: 3, trash: 4}
	verifyResources: function (player, wishlist) {
		var tracker = {
			coal: 0,
			oil: 0,
			trash: 0,
			nuke: 0,
			hybrid: 0
		};
		player.plants.forEach(function (plant) {
			if(plant.resourceType !== 'green') {
				tracker[plant.resourceType] += plant.numResources*2;
			}
		});
		for(var resource in player.resources) {
			if (!wishlist[resource]) wishlist[resource] = 0;
			tracker[resource] -= ( wishlist[resource] + player.resources[resource] );
		}
		for(var resource in tracker) {
			if (tracker[resource] < 0) {
				if (resource === 'coal' || resource === 'oil') {
					tracker.hybrid += tracker[resource];
				} else {
					return false;
				}
			}
		}
		return tracker.hybrid >= 0;
	}
}

// test:
// var player = {
// 	plants: [
// 		{
// 			resourceType: 'nuke',
// 			numResources: 1
// 		},
// 		{
// 			resourceType: 'hybrid',
// 			numResources: 2
// 		},
// 		{
// 			resourceType: 'coal',
// 			numResources: 3
// 		}
// 	],
// 	resources: {coal: 4, oil: 0, trash: 0, nuke: 0}
// };
// var wishlist = {nuke: 1, coal: 3, oil: 3};
// console.log(canBuyResources(player, wishlist));