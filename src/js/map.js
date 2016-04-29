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

  var storerequest = {
    location: {lat: 41.908730, lng: -87.679385},
    radius: 1000,
    types: ['store']
  };

  var foodrequest = {
    location: {lat: 41.908730, lng: -87.679385},
    radius: 1000,
    types: ['restaurant']
  };

  var infowindow = new google.maps.InfoWindow();

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(storerequest, callback);
  service.nearbySearch(foodrequest, callback);

  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      visible: true
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }
}
