function Restock(coal, oil, trash, nuke) {
	this.coal = coal;
	this.oil = oil;
	this.trash = trash;
	this.nuke = nuke;
}

var restockRates = {
	2: {
		1: new Restock(3,2,1,1),
		2: new Restock(4,2,2,1),
		3: new Restock(3,4,3,1),
	},
	3:{
		1: new Restock(4,2,1,1),
		2: new Restock(5,3,2,1),
		3: new Restock(3,4,3,1),
	},
	4:{
		1: new Restock(5,3,2,1),
		2: new Restock(6,4,3,2),
		3: new Restock(4,5,4,2),
	},
	5:{
		1: new Restock(5,4,3,2),
		2: new Restock(7,5,3,2),
		3: new Restock(5,6,5,2),
	},
	6:{
		1: new Restock(7,5,3,2),
		2: new Restock(9,6,5,3),
		3: new Restock(6,7,6,3),
	}
}

module.exports = restockRates;