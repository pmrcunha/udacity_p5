/* main.js*/

// Data Model

var placeData = [
	{
		title: 'Fotografiska',
		pos: {lat: 59.3178187, lng: 18.0858394},
		category: 'Museum',
		type: 'fun',
		content: '<p>Banana1</p>'
	},
	{
		title: 'Gröna Lund',
		pos: {lat: 59.3233503, lng: 18.0963003},
		category: 'Amusement Park',
		type: 'fun',
		content: '<p>Banana2</p>'
	},
	{
		title: 'Moderna Museet',
		pos: {lat: 59.3260426, lng: 18.084607},
		category: 'Museum',
		type: 'fun',
		content: '<p>Banana3</p>'
	},
	{
		title: 'Stadsbiblioteket',
		pos: {lat: 59.3434101, lng: 18.0546555},
		category: 'Library',
		type: 'fun',
		content: '<p>Banana4</p>'
	},
	{
		title: "Skype",
		pos: {lat: 59.3206951, lng: 18.0514177},
		category: 'Tech Company',
		type: 'work',
		content: '<p>Banana5</p>'
	},
	{
		title: 'Bonnier Media',
		pos: {lat: 59.3369941, lng: 18.0425881},
		category: 'Publisher',
		type: 'work',
		content: '<p>Banana6</p>'
	},
	{
		title: 'Google',
		pos: {lat: 59.333404, lng: 18.0543282},
		category: 'Tech Company',
		type: 'work',
		content: '<p>Banana7</p>'
	},
	{
		title: 'Spotify',
		pos: {lat: 59.3422246, lng: 18.0637341},
		category: 'Tech Company',
		type: 'work',
		content: '<p>Banana8</p>'
	}
];

//Google Maps API

var Map = function(mapOptions, mapStyles) {
	this.mapStyles = mapStyles;
	this.infoWindows = [];
	this.markers = [];
	this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
};

Map.prototype.openInfoWindow = function(i) {
	this.infoWindows[i].open(this.map, this.markers[i]);
};

Map.prototype.clearMarkers = function() {
	/*for(var i=0; i< this.markers.length; i++) {
		self.markers[i].setMap(null);
	}*/
	self.markers = [];
};

Map.prototype.updateMarkers = function(searchResults) {
	var self = this;
	//self.clearMarkers();
	for(var i=0; i<searchResults.length; i++) {
		var markerOptions = {
			position: searchResults[i].pos,
			title: searchResults[i].title
		};

		self.markers[i] = new google.maps.Marker(markerOptions);
		self.markers[i].setMap(self.map);

		self.infoWindows[i] = new google.maps.InfoWindow({
			content: '<h1>' + searchResults[i].title + '</h1>' +
			'<h3>' + searchResults[i].category + '</h3>' +
			'<p>' + searchResults[i].content + '</p>'
		});

		/* A closure is required to add a listener inside a loop,
		 * otherwise the function will use the last value of the iterator.
		 */
		(function(_i) {
			self.markers[_i].addListener('click', function() {
				self.openInfoWindow(_i);
			});
		})(i);
	}
};

/*Map.prototype.removeMarkers = function(excluded) {
	for(var i=0; i<excluded.length; i++) {
		if(excluded[i].title == this.markers)
	}
}*/

var map;

function initMap() {

	// Google Maps API Styling
	var mapStyles = [
	{
		stylers: [
		{ saturation: -40},
		{lightness: 20}
		]
	},{
		featureType: "road",
		elementType: "labels",
		stylers: [
		{visibility: "off"}
		]
	},{
		featureType: "road",
		elementType: "geometry",
		stylers: [
		{lightness: 100},
		{visibility: "simplified"}
		]
	},{
		featureType: "road",
		elementType: "labels",
		stylers: [
		{visibility: "off"}
		]
	},{
		featureType: "poi",
		elementType: "labels",
		stylers: [
		{visibility: "off"}
		]
	}
	];

	var mapOptions = {
		center: {lat: 59.332309, lng: 18.064582},
		zoom: 14,
		mapTypeControl: false,
		panControl: false,
		zoomControl: false,
		streetViewControl: false,
		styles: mapStyles
	};

	map = new Map(mapOptions, mapStyles);
	map.updateMarkers(placeData);
};


// ViewModel
// Search
function ViewModel() {
	var self = this;

	//Data

	self.searchQuery = ko.observable("Search");

	self.searchResults = ko.computed(function() {
		if(self.searchQuery() == "" || self.searchQuery() == "Search") {
			return placeData;
		}
		else {
			var results =[];
			var excluded = [];
			for(var i=0; i < placeData.length; i++) {
				if(placeData[i].title.toLowerCase().indexOf(self.searchQuery().toLowerCase()) >=0) {
					results.push(placeData[i]);
				}
			}
			//map.updateMarkers(results);
			return results;
		}
	});

	//Behaviors

	self.selectLocation = function(location) {
		var i = self.searchResults().indexOf(location);
		map.openInfoWindow(i);
	}

	self.searchQuery.subscribe(function(){
		map.updateMarkers(self.searchResults());
	})


//TODO: Call update markers on searchResults
	/*self.searchMarkers = function() {
		map.updateMarkers(self.searchResults());
	}*/

};

// var only for debugging
var VModel = new ViewModel();
ko.applyBindings(VModel);

// Wikipedia API
