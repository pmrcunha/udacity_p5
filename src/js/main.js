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

// Constructors

// ViewModel

//Google Maps API

var infoWindows = [];
var markers = [];
var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 59.332309, lng: 18.064582},
		zoom: 14,
		mapTypeControl: false,
		panControl: false,
		zoomControl: false,
		streetViewControl: false,
		styles: mapStyles
	});

	for(var i=0; i<placeData.length; i++) {
		markers[i] = new google.maps.Marker({
			position: placeData[i].pos,
			title: placeData[i].title,
			map: map
		});

		infoWindows[i] = new google.maps.InfoWindow({
			content: '<h1>' + placeData[i].title + '</h1>' +
				'<h3>' + placeData[i].category + '</h3>' +
				'<p>' + placeData[i].content + '</p>'
		});

		/* A closure is required to add a listener inside a loop,
		 * otherwise the function will use the last value of the iterator.
		 */
		(function(_i) {
			markers[_i].addListener('click', function() {
				infoWindows[_i].open(map, markers[_i]);
			});
		})(i);
	}
}

// Search
function ViewModel() {
	this.searchQuery = ko.observable("Search");

	this.locations = ko.observableArray(placeData);

	this.selectLocation = function(location) {
		var i = placeData.indexOf(location);
		infoWindows[i].open(map, markers[i]);
	}

};

ko.applyBindings(new ViewModel());




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