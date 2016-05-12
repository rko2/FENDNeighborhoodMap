var map;
var allMarkers = [];
var infoWindow;
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
}

var makeInfoWindow = function(m) {
  // Set the content for each info window.
  var windowContent = '<div class="InfoWindow">';
  windowContent += '<div class="TopInfo>"<h4>' + m.title + '</h4>';
  windowContent += '<p>' + m.phone + '</p></div>';
  windowContent += '<div class="Snippet"><img src="' + m.snipimg + '"><p>' + m.sniptext + '</p></div>';
  windowContent += '</div>';
  infoWindow = new google.maps.InfoWindow();

  // Set info window content.
  infoWindow.setContent(String(windowContent));
  infoWindow.open(map, m);
}

// Create markers to put on the map.
var googleMarkers = function(places) {
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

  for (var i = 0; i < places.length; i++) {
    // Set marker parameters using function input.
    var position = new google.maps.LatLng(places[i][2], places[i][3]);

    var mrkr = new google.maps.Marker({
      position: position,
      map: map,
      title: places[i][0],
      phone: places[i][1],
      sniptext: places[i][4],
      snipimg: places[i][5],
      visible: true
    });

    allMarkers.push(mrkr);
    // Use event listener to display info window when marker is clicked.
    google.maps.event.addListener(mrkr, 'click', (function(m, i) {
      return function() {
        makeInfoWindow(m);
        bounce(m);
      };
    })(mrkr, i));
  }
  // Use event listeners to toggle highlight class when list item is moused over, and display corresponding info window.
  var li = $("li");
  // Add marker bounce when list items are clicked.
  li.click(function() {
    var pos = $("li").index(this);
    bounce(allMarkers[pos]);
  });
  // Highlight moused-over list item via class change.
  li.mouseover(function() {
    $(this).addClass("Selected");
    var pos = $("li").index(this);
    makeInfoWindow(allMarkers[pos]);
  });
  // Un-highlight list item when mouse stops hovering.
  li.mouseout(function() {
    $(this).removeClass("Selected");
  });
}
// This function animates google maps markers.
var bounce = function(bouncer) {
  for (var i = 0; i < allMarkers.length; i++) {
    allMarkers[i].setAnimation(null);
  }
  bouncer.setAnimation(google.maps.Animation.BOUNCE);
}

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
}
// Yelp ajax request.
var yelpAjax = function(url, yelpdata) {
  $.ajax({
    'url': url,
    'data': yelpdata,
    'dataType': 'jsonp',
    'global': true,
    'cache': true,
    'jsonpCallback': 'cb',
    'timeout': 5000,
    'success': function(data) {
      var results = data.businesses;
      ajaxResults([]);
      if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
          ajaxResults.push(results[i]);
        }
      } else {
        emptyResults(true);
      }
    },
    // Implement error handling using timeout for jsonp.
    'error': function(x, t, m) {
      if (t === 'timeout') {
        alert("Looks like something didn't work out with the Yelp! search.");
      }
    }
  });
}
// Take returned data and display it on list.
var listDisplay = function(data) {
  var yelpResults = $('.results');
  var results = data.businesses;
  var markers = [];
  var listing = '';

  yelpResults.empty();
  if (results.length > 0) {

    // Iterate through results and create listings.
    for (var i = 0; i < results.length; i++) {
      var business = results[i],
      listing = '<li id="list"><a href="' + url + '" target="_blank">' + name + '</a>' + " " + '<img src="' + rating + '"></li><br>';


      // Create the individual marker.
      var marker = [name, phone, lat, long, sniptext, snipimg];
      // Push individual markers into array.
      markers.push(marker);

      // Add results to the list.
      yelpResults.append(listing);
    }

    // Place markers on map with Google Maps.
    google.maps.event.addDomListener(window, 'load', googleMarkers(markers));

  } else {
    // If there are somehow no hits (so not due to error), display this in result listing.
    var searchedFor = $('input').val();
    yelpResults.append('<li><h3>Oh no! We can\'t seem to find anything for <span>' + searchedFor + '</span>.</h3><p>Try something else.</p></li>');

    //	Use google map api to clear the markers on the map
    google.maps.event.addDomListener(window, 'load', googleMarkers(markers));
  }
}
