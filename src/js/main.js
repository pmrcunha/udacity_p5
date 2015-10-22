/* main.js*/

//This is a simple viewmodel

function AppViewModel() {
	this.firstName = "Paulo";
}

//Activates knockout.js
//ko.applyBindings(new AppViewModel());


//Testing Google Maps API

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8
	});
}