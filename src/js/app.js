// Initialize the map.

var map;
var service;
var infowindow;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 41.908730,
      lng: -87.679385
    },
    zoom: 15,
    styles: [{
      featureType: 'poi',
      stylers: [{
          visibility: 'on'
        }] // Turn on points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{
          visibility: 'off'
        }] // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });
}

var Locations = [{
  name: "Name1",
  address: "Address1"
}, {
  name: "Name2",
  address: "Address2"
}];

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
}

var ViewModel = function() {
  var self = this;

  this.placelist = ko.observableArray([]);
  Locations.forEach(function(locationitem) {
    self.placelist.push(new Location(locationitem));
  });

  this.currentplace = ko.observable(this.placelist()[0]);

  this.SetPlace = function(clickedPlace) {
    self.currentplace(clickedPlace);
  };
}

ko.applyBindings(new ViewModel());
