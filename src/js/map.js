var map;
var allMarkers = [];
var infoWindow = null;
// Initialize the map.
var initMap = function(data) {
  // Use Google Maps geocode service to determine center dynamically.
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'address': data
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });

  // Create the map.
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    disableDoubleClickZoom: true
  });
};

// Make info windows when called from a marker.
var makeInfoWindow = function(data) {
  if (infoWindow) {
    infoWindow.close();
  }
  // Set the content for each info window.
  var windowContent = '<div class="InfoWindow">';
  windowContent += '<div class="TopInfo>"<h4>' + data.title + '</h4>';
  windowContent += '<p>' + data.phone + '</p></div>';
  windowContent += '<div class="Snippet"><img src="' + data.snipimg + '"><p>' + data.sniptext + '</p></div>';
  windowContent += '</div>';
  infoWindow = new google.maps.InfoWindow();

  // Set info window content.
  infoWindow.setContent(String(windowContent));
  infoWindow.open(map, data);
};

// Make info windows when called from a list item.
var makeInfoWindowFromList = function(data) {
  if (infoWindow) {
    infoWindow.close();
  }
  // Set the content for each info window.
  var windowContent = '<div class="InfoWindow">';
  windowContent += '<div class="TopInfo>"<h4>' + data.name + '</h4>';
  windowContent += '<p>' + data.display_phone + '</p></div>';
  windowContent += '<div class="Snippet"><img src="' + data.snippet_image_url + '"><p>' + data.snippet_text + '</p></div>';
  windowContent += '</div>';
  infoWindow = new google.maps.InfoWindow();

  // Set info window content.
  infoWindow.setContent(String(windowContent));
  infoWindow.open(map, data.marker);
  bounce(data.marker);
};

var matcher;

// Filter ajax results using query.
var nameMatch = function(data) {
  if (data) {
    filteredResults([]);
    for (var j = 0; j < allMarkers.length; j++) {
      allMarkers[j].setVisible(false);
    }
    var searchFilter = new RegExp(data, 'i');
    for (var i = 0; i < ajaxResults().length; i++) {
      matcher = ajaxResults()[i].name.toLowerCase();
      if (searchFilter.test(matcher) === true) {
        allMarkers[i].setVisible(true);
        filteredResults.push(ajaxResults()[i]);
      }
    }
  }
};

// Reset list to display all initial Yelp results.
var listReset = function() {
  filteredResults([]);
  for (var i = 0; i < ajaxResults().length; i++) {
    filteredResults.push(ajaxResults()[i]);
  }
};

var markerReset = function() {
  for (var i = 0; i < allMarkers.length; i++) {
    allMarkers[i].setVisible(true);
  }
};


// Create markers to put on the map.
var googleMarkers = function(data) {
  // Clear markers before creating new ones.
  function deleteMarkers() {
    for (var i = 0; i < allMarkers.length; i++) {
      allMarkers[i].setMap(null);
    }
    allMarkers = [];
  }

  if (allMarkers.length > 0) {
    deleteMarkers();
  }
  var results = data.businesses;
  ajaxResults([]);
  filteredResults([]);
  if (results.length > 0) {
    markers = [];
    for (var i = 0; i < results.length; i++) {
      results[i].highlighted = ko.observable(false);
      ajaxResults.push(results[i]);
      filteredResults.push(results[i]);
      var position = new google.maps.LatLng(results[i].location.coordinate.latitude, results[i].location.coordinate.longitude);
      results[i].marker = new google.maps.Marker({
        position: position,
        title: results[i].name,
        phone: results[i].display_phone,
        snipimg: results[i].snippet_image_url,
        sniptext: results[i].snippet_text,
        map: map,
        visible: true
      });
      allMarkers.push(results[i].marker);
      google.maps.event.addListener(results[i].marker, 'click', (function(m, i) {
        return function() {
          makeInfoWindow(m);
          bounce(m);
        };
      })(results[i].marker, i));
    }
  }
};
// This function animates google maps markers.
var bounce = function(bouncer) {
  for (var i = 0; i < allMarkers.length; i++) {
    allMarkers[i].setAnimation(null);
  }
  bouncer.setAnimation(google.maps.Animation.BOUNCE);
};

var yelp = function(around, searchfor) {
  var auth = {

    // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
    // You wouldn't actually want to expose your access token secret like this in a real application.
    consumerKey: "PDTwNISGHOMT--mxGVuM9w",
    consumerSecret: "id_cBoLI1WywV1Pgechh_o8qnbE",
    accessToken: "56ehWaYgsMGVbzmfQQb90OKbAOxhYbPQ",
    accessTokenSecret: "8T_r9zF3EV3WH65VIiaknZB34qg",
    serviceProvider: {
      signatureMethod: "HMAC-SHA1"
    }
  };

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };

  parameters = [];
  parameters.push(['term', searchfor]);
  parameters.push(['location', around]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
  yelpAjax(message.action, parameterMap);
};
// Yelp ajax request.
var yelpAjax = function(url, yelpdata) {
  $.ajax({
    'url': url,
    'data': yelpdata,
    'dataType': 'jsonp',
    'global': true,
    'cache': true,
    'jsonpCallback': 'cb',
    'timeout': 3000,
    'success': function(data) {
      googleMarkers(data);
    },
    // Implement error handling using timeout for jsonp.
    'error': function(x, t, m) {
        alert("Looks like something didn't work out with the Yelp! search.");
    }
  });
};
