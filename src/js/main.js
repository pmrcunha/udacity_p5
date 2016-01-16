/* main.js*/

// Data Model

var placeData = [
	{
		title: 'Fotografiska',
		pos: {lat: 59.3178187, lng: 18.0858394},
		category: 'Museum',
		type: 'fun',
		foursquareVenueID: '4bf57390706e20a1067daa98',
		content: '<p>Banana1</p>'
	},
	{
		title: 'Gröna Lund',
		pos: {lat: 59.3233503, lng: 18.0963003},
		category: 'Amusement Park',
		type: 'fun',
		foursquareVenueID: '4adcdaeef964a520a05a21e3',
		content: '<p>Banana2</p>'
	},
	{
		title: 'Moderna Museet',
		pos: {lat: 59.3260426, lng: 18.084607},
		category: 'Museum',
		type: 'fun',
		foursquareVenueID: '4adcdaeff964a520e45a21e3',
		content: '<p>Banana3</p>'
	},
	{
		title: 'Stadsbiblioteket',
		pos: {lat: 59.3434101, lng: 18.0546555},
		category: 'Library',
		type: 'fun',
		foursquareVenueID: '4adcdaeef964a520b65a21e3',
		content: '<p>Banana4</p>'
	},
	{
		title: "Skype",
		pos: {lat: 59.3206951, lng: 18.0514177},
		category: 'Tech Company',
		type: 'work',
		foursquareVenueID: '4c07887a8a81c9b651502790',
		content: '<p>Banana5</p>'
	},
	{
		title: 'Bonnier Museum',
		pos: {lat: 59.3369941, lng: 18.0425881},
		category: 'Museum',
		type: 'fun',
		foursquareVenueID: '4af1b187f964a52044e221e3',
		content: '<p>Banana6</p>'
	},
	{
		title: 'Google',
		pos: {lat: 59.333404, lng: 18.0543282},
		category: 'Tech Company',
		type: 'work',
		foursquareVenueID: '4bd8263335aad13afd2690f3',
		content: '<p>Banana7</p>'
	},
	{
		title: 'Spotify',
		pos: {lat: 59.3422246, lng: 18.0637341},
		category: 'Tech Company',
		type: 'work',
		foursquareVenueID: '4ff1826fe4b0cf98814a6b9b',
		content: '<p>Banana8</p>'
	}
];

// Foursquare API

var foursquareEP = 'https://api.foursquare.com/v2/venues/';
var clientID = 'ABND2BJJYOCBN02BNPOIUXZL34AFIPQK4WC3DRAREHKVMPNQ';
var clientSecret = 'NGNJHIY1DH13PHPRGDEUZCXKSISR404GPWOX4LBBFEBOZMYU';

function getFoursquareRequestURL(foursquareVenueID) {
	return foursquareEP + foursquareVenueID + '?client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20151220&m=foursquare';
};

function getFoursquareVenueData(i) {
	$.getJSON(getFoursquareRequestURL(placeData[i].foursquareVenueID), function(data) {
		console.log(data.response.venue.name);
		return data.response.venue.name;
	});
};

//Google Maps API

var Map = function(mapOptions, mapStyles) {
	this.mapStyles = mapStyles;
	this.infoWindows = [];
	this.markers = [];
	this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
};

Map.prototype.toggleInfoWindow = function(i) {
	var marker = this.markers[i];
	infoWindow = this.infoWindows[i];
	if(marker.getAnimation() !== null) {
		marker.setAnimation(null);
		infoWindow.close();
	}
	else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		infoWindow.open(this.map, marker);
	}
};

Map.prototype.setupMarkers = function() {
	var self = this;
	for(var i=0; i<placeData.length; i++) {
		var markerOptions = {
			position: placeData[i].pos,
			title: placeData[i].title
		};

		self.markers[i] = new google.maps.Marker(markerOptions);
		self.markers[i].setMap(self.map);
		self.markers[i].setAnimation(google.maps.Animation.DROP);

			console.log(getFoursquareVenueData(i));


		self.infoWindows[i] = new google.maps.InfoWindow({
			content: '<h1>' + placeData[i].title + '</h1>' +
			'<h3>' + placeData[i].category + '</h3>' +
			'<p>' + placeData[i].content + '</p>' +
			'<p>' + getFoursquareVenueData(i) + '</p>'
		});

		/* A closure is required to add a listener inside a loop,
		 * otherwise the function will use the last value of the iterator.
		 */
		(function(_i) {
			self.markers[_i].addListener('click', function() {
				self.toggleInfoWindow(_i);
			});
		})(i);
	}
};

Map.prototype.clearMarkers = function() {
	var self = this;
	for(var i=0; i<self.markers.length; i++) {
		(function(_i) {
			self.markers[_i].setMap(null);
		})(i);
	}
};

Map.prototype.filterMarkers = function(searchResults) {
	var self = this;
	self.clearMarkers();
	for(i=0; i<searchResults.length; i++) {
		var m = placeData.indexOf(searchResults[i]); //m is the index in PlaceData of a location that exists in searchResults (argument)

		(function(_i) {
			if(m >= 0) {
				self.markers[m].setMap(self.map);
				self.markers[m].setAnimation(google.maps.Animation.DROP);
			}
		})(i);
	}
};

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
	map.setupMarkers();
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
			for(var i=0; i < placeData.length; i++) {
				if(placeData[i].title.toLowerCase().indexOf(self.searchQuery().toLowerCase()) >=0) {
					results.push(placeData[i]);
				}
			}
			map.filterMarkers(results);
			return results;
		}
	});

	//Behaviors

	/* Clicking on the list pops up the info window */
	self.selectLocation = function(location) {
		var i = self.searchResults().indexOf(location);
		map.toggleInfoWindow(i);
	}

	/* When searchQuery is updated, filterMarkers runs */
	self.searchQuery.subscribe(function(){
		map.filterMarkers(self.searchResults());
	});

};

// var only for debugging
var VModel = new ViewModel();
ko.applyBindings(VModel);

