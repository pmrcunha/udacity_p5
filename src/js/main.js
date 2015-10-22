/* main.js*/

//This is a simple viewmodel

function AppViewModel() {
	this.firstName = "Paulo";
}

//Activates knockout.js
ko.applyBindings(new AppViewModel());