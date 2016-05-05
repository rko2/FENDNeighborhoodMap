// Initialize the map.

var map;
var service;
var infowindow;

function initMap() {
  // Set default center.
  var WickerPark = new google.maps.LatLng(41.908730, -87.679385);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: WickerPark,
    zoom: 15,
    disableDoubleClickZoom: true
  });
}

var ViewModel = function() {
  var self = this;

  this.Term = ko.observable('Tattoo Shops');

  this.updateResults = function(searched) {
  };
}

ko.applyBindings(new ViewModel());
