var map;
var allmarkers = [];
var infowindow = new google.maps.InfoWindow();
// Initialize the map.
function initMap(data) {
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

function makeinfowindow(m) {
  // Set the content for each info window.
  var windowContent = '<div class="infowindow">';
  windowContent += '<div class="topinfo>"<h4>' + m.title + '</h4>';
  windowContent += '<p>' + m.phone + '</p></div>';
  windowContent += '<div class="snippet"><img src="' + m.snipimg + '"><p>' + m.sniptext + '</p></div>';
  windowContent += '</div>';

  // Set info window content.
  infowindow.setContent(String(windowContent));
  infowindow.open(map, m);
}

// Create markers to put on the map.
function googleMarkers(places) {
  // Clear markers before creating new ones.
  function deleteMarkers() {
    for (var i = 0; i < allmarkers.length; i++) {
      allmarkers[i].setMap(null);
    }
    allmarkers = [];
  }

  if (allmarkers.length > 0) {
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

    allmarkers.push(mrkr);
    // Use event listeners to display info window when marker is clicked or moused over.
    google.maps.event.addListener(mrkr, 'mouseover', (function(m, i) {
      return function() {
        makeinfowindow(m);
      };
    })(mrkr, i));

    google.maps.event.addListener(mrkr, 'click', (function(m, i) {
      return function() {
        makeinfowindow(m);
      };
    })(mrkr, i));
  }
  // Use event listeners to toggle highlight class when list item is moused over, and display corresponding info window.
  var li = $("li");
  li.click(function() {
    var pos = $("li").index(this);
    bounce(allmarkers[pos]);
  })
  li.mouseover(function() {
    $(this).addClass("selected");
    var pos = $("li").index(this);
    makeinfowindow(allmarkers[pos]);
  })
  li.mouseout(function() {
    $(this).removeClass("selected");
  })
}

function bounce(bouncer) {
  if (bouncer.getAnimation() !== null) {
    bouncer.setAnimation(null);
  } else {
    bouncer.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function Yelp(around, searchfor) {
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
  yelpajax(message.action, parameterMap);
}

function yelpajax(url, yelpdata) {
  $.ajax({
    'url': url,
    'data': yelpdata,
    'dataType': 'jsonp',
    'global': true,
    'cache': true,
    'jsonpCallback': 'cb',
    'timeout': 5000,
    'success': function(data) {
      listdisplay(data);
    },
    // Implement error handling using timeout for jsonp.
    'error': function(x, t, m) {
      if (t === 'timeout') {
        alert("Looks like something didn't work out with the Yelp! search.");
      }
    }
  });
}

function listdisplay(data) {
  var yelpResults = $('.results');
  var results = data.businesses;
  var markers = [];
  var listing = '';

  yelpResults.empty();
  if (results.length > 0) {

    // Iterate through results and create listings.
    for (var i = 0; i < results.length; i++) {
      var business = results[i],
        name = business.name,
        img = business.image_url,
        phone = business.display_phone,
        url = business.url,
        rating = business.rating_img_url_small,
        lat = business.location.coordinate.latitude,
        long = business.location.coordinate.longitude,
        sniptext = business.snippet_text,
        snipimg = business.snippet_image_url,
        loc = business.location.display_address;
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

initMap('Wicker Park');
Yelp('Wicker Park', 'Bars');
