/** 
 * @description
 * main.js contains the Model and ViewModel of the MapApp application.
 * 
 * @author
 * Paulo Cunha
 *
 */

'use strict';

// Data Model

var locationData = [
	{
		title: 'Fotografiska',
		pos: {lat: 59.3178187, lng: 18.0858394},
		category: 'Museum',
		foursquareVenueID: '4bf57390706e20a1067daa98'
	},
	{
		title: 'Gröna Lund',
		pos: {lat: 59.3233503, lng: 18.0963003},
		category: 'Amusement Park',
		foursquareVenueID: '4adcdaeef964a520a05a21e3'
	},
	{
		title: 'Moderna Museet',
		pos: {lat: 59.3260426, lng: 18.084607},
		category: 'Museum',
		foursquareVenueID: '4adcdaeff964a520e45a21e3'
	},
	{
		title: 'Stadsbiblioteket',
		pos: {lat: 59.3434101, lng: 18.0546555},
		category: 'Library',
		foursquareVenueID: '4adcdaeef964a520b65a21e3'
	},
	{
		title: "Skype",
		pos: {lat: 59.3206951, lng: 18.0514177},
		category: 'Tech Company',
		foursquareVenueID: '4c07887a8a81c9b651502790'
	},
	{
		title: 'Bonnier Museum',
		pos: {lat: 59.3369941, lng: 18.0425881},
		category: 'Museum',
		foursquareVenueID: '4af1b187f964a52044e221e3'
	},
	{
		title: 'Google',
		pos: {lat: 59.333404, lng: 18.0543282},
		category: 'Tech Company',
		foursquareVenueID: '4bd8263335aad13afd2690f3'
	},
	{
		title: 'Spotify',
		pos: {lat: 59.3422246, lng: 18.0637341},
		category: 'Tech Company',
		foursquareVenueID: '4ff1826fe4b0cf98814a6b9b'
	}
];

// Foursquare API

//TODO: Create a server side function to provide the API keys without exposing them.
var FOURSQUARE_EP = 'https://api.foursquare.com/v2/venues/';
var CLIENT_ID = 'ABND2BJJYOCBN02BNPOIUXZL34AFIPQK4WC3DRAREHKVMPNQ';
var CLIENT_SECRET = 'NGNJHIY1DH13PHPRGDEUZCXKSISR404GPWOX4LBBFEBOZMYU';

// Concatenates the URL for the AJAX request
function getFoursquareRequestURL(foursquareVenueID) {
	return FOURSQUARE_EP + foursquareVenueID + '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20151220&m=foursquare';
}

// Tests if a variable is defined. Used to test the venue parameters received from Foursquare.
function checkIfDefined(data) {
	if(typeof data !== 'undefined' && data !== null) {
		return true;
	}
	return false;
}

// Fetches venue data from Foursquare asynchronously, adds it to the data model and creates an infoWindow.
// Receives an index for the venue in the data model (locationData). 
var getFoursquareVenueData = function(i) {
	$.getJSON(getFoursquareRequestURL(locationData[i].foursquareVenueID), function(data) {
		var FQresponse = data.response.venue;
		// Adding the venue info to the data model
		// If a property of the venue is undefined, we pass an empty string to the infoWindow constructor.
		locationData[i].FQdescription = checkIfDefined(FQresponse.description) ? '<p>' + FQresponse.description + '</p>' : '';
		locationData[i].FQrating = checkIfDefined(FQresponse.rating) ? '<p>Foursquare rating: ' + FQresponse.rating + '</p>' : '';
		locationData[i].FQurl = checkIfDefined(FQresponse.url) ? '<a href="' + FQresponse.url + '" target="_blank">Website</a>' : '';
		// Creating the Info Windows
		map.infoWindows[i] = new google.maps.InfoWindow({
			content: '<h1>' + locationData[i].title + '</h1>' +
			'<h3>' + locationData[i].category + '</h3>' +
			locationData[i].FQdescription +
			locationData[i].FQrating +
			locationData[i].FQurl
		});
		// Stop marker animation if the user closes the infoWindow
		google.maps.event.addListener(map.infoWindows[i], 'closeclick', function(){
			map.markers[i].setAnimation(null);
		});

		// Fallback function
	}).fail(function() {
		map.infoWindows[i] = new google.maps.InfoWindow({
		content: '<h1>' + locationData[i].title + '</h1>' +
		'<h3>' + locationData[i].category + '</h3>' +
		'<p>' + locationData[i].content + '</p>' +
		'<p class="error">Foursquare info could not be loaded.</p>'
		});
		// Stop marker animation if the user closes the infoWindow
		google.maps.event.addListener(map.infoWindows[i], 'closeclick', function(){
			map.markers[i].setAnimation(null);
		});
	return 'Foursquare info could not be loaded.';
	});
};

//Google Maps API

var Map = function(mapOptions, mapStyles) {
	this.mapStyles = mapStyles;
	this.infoWindows = [];
	this.markers = [];
	this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
};

// Builds the location markers, right after the map is instantiated.
Map.prototype.setupMarkers = function() {
	var self = this;
	self.clearMarkers();
	for(var i=0, len=locationData.length; i<len; i++) {
		var markerOptions = {
			position: locationData[i].pos,
			title: locationData[i].title
		};

		self.markers[i] = new google.maps.Marker(markerOptions);
		self.markers[i].setMap(self.map);
		self.markers[i].setAnimation(google.maps.Animation.DROP);

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
	for(var i=0, len=self.markers.length; i<len; i++) {
		(function(_i) {
			self.markers[_i].setMap(null);
		})(i);
	}
};

// Reveals the location markers that match the search query. Runs everytime the search fiels is edited.
Map.prototype.filterMarkers = function(searchResults) {
	var self = this;
	self.clearMarkers();
	for(var i=0, len=searchResults.length; i<len; i++) {
		var m = locationData.indexOf(searchResults[i]); //m is the index in locationData of a location that exists in searchResults (argument)
		if(m >= 0) {
			self.markers[m].setMap(self.map);
			self.markers[m].setAnimation(google.maps.Animation.DROP);
		}	
	}
};

// Builds all the info windows, after the map is intantiated.
Map.prototype.setupInfoWindows = function() {
	var self = this;
	self.infoWindows = [];
	for(var i=0, len=locationData.length; i<len; i++) {
		getFoursquareVenueData(i); // this function builds the infoWindow for each location.
	}
};



Map.prototype.clearInfoWindows = function() {
	var self = this;
	for(var i=0, len=locationData.length; i<len; i++) {
		self.markers[i].setAnimation(null);
		self.infoWindows[i].close();
	}
};

// Opens or closes an info window, and starts or stops the marker animation.
Map.prototype.toggleInfoWindow = function(i) {
	var marker = this.markers[i];
	var infoWindow = this.infoWindows[i];
	if(marker.getAnimation() !== null) {
		marker.setAnimation(null);
		infoWindow.close();
	}
	else {
		this.clearInfoWindows();
		marker.setAnimation(google.maps.Animation.BOUNCE);
		infoWindow.open(this.map, marker);
	}
};

// The instantiated map has to be on global scope, for Knockout to be able to reach it.
var map;

// Fallback function for the Google Maps API.
function errorMap() {
	alert('There was a problem connecting to Google. Please check your Internet connection.');
}

// Callback function for the Google Maps API. This function instantiates the map, creates the markers, and the info Windows.
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
	map.setupInfoWindows();
}

// ViewModel
function ViewModel() {
	var self = this;

	//Search
	// Get the search query from the text field.
	self.searchQuery = ko.observable("");

	// Returns a list of locations that match the search criteria, and filters the markers.
	self.searchResults = ko.computed(function() {
		// Show all locations if the search field is empty or unedited.
		if(self.searchQuery() === "") {
			// Reset the markers. These functions can't run before the map is intantiated.
			if(typeof map !== 'undefined' && map !== null){
				map.clearMarkers();
				map.setupMarkers();
			}
			return locationData;
		}
		else {
			var results =[];
			for(var i=0, len=locationData.length; i<len; i++) {
				// indexOf returns the index of the first occurrence of the search query in the location's title. If not present, returns -1.
				if(locationData[i].title.toLowerCase().indexOf(self.searchQuery().toLowerCase()) >=0) {
					results.push(locationData[i]); // Every location that partially matches the search query gets pushed to results.
				}
			}
			map.filterMarkers(results);
			return results;
		}
	});

	/* Clicking on the location name on the list pops up the info window */
	self.selectLocation = function(location) {
		var i = locationData.indexOf(location);
		map.toggleInfoWindow(i);
	};

	/* Everytime the search field is edited, and searchQuery is updated, filterMarkers runs. */
	self.searchQuery.subscribe(function(){
		map.filterMarkers(self.searchResults());
	});
}

ko.applyBindings(new ViewModel());