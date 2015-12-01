function priceOfOne(resourceType, market) {
	var amount = market[resourceType];
	if (resourceType === 'nuke') {
		if (amount < 5) {
			return 18 - 2*amount;
		} else {
			return 13 - amount;
		}
	} else {
		return 8 - Math.floor((amount-1)/3);
	}
}

module.exports = function totalPrice(wishlist, market) {
	var total = 0;
	marketCopy = {};
	for(var resource in market) {
		marketCopy[resource] = market[resource];
	}
	for(var resource in wishlist) {
		for(var i = 0; i < wishlist[resource]; i++) {
			total += priceOfOne(resource, marketCopy);
			marketCopy[resource]--;
		}
	}
	return total;
}