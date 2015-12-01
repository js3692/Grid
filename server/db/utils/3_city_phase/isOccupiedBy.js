module.exports = function isOccupiedBy(player, city) {
	return city.players.some(function (p) {
		return p.user._id.equals(player.user._id);
	})
}