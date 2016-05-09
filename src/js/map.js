// Initialize the map.

var map;
var allmarkers = [];

function initMap() {
  // Set default center.
  var WickerPark = new google.maps.LatLng(41.908730, -87.679385);

  // Create the map.
  map = new google.maps.Map(document.getElementById('map'), {
    center: WickerPark,
    zoom: 15,
    disableDoubleClickZoom: true
  });
}

// Create markers to put on the map.
function googleMarkers(places) {
  var infowindow = new google.maps.InfoWindow();

  function makeinfowindow(m) {
    var windowContent = '<div class="infowindow">';
    windowContent += '<div class="topinfo>"<h4>' + m.title + '</h4>';
    windowContent += '<p>' + m.phone + '</p></div>';
    windowContent += '<div class="snippet"><img src="' + m.snipimg + '"><p>' + m.sniptext + '</p></div>';
    windowContent += '</div>';

    // Set info window content.
    infowindow.setContent(String(windowContent));
    infowindow.open(map, m);
  }

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
    'cache' : true,
    'jsonpCallback': 'cb',
    'success': function(data) {
      listdisplay(data);
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
      listing = '<li><a href="' + url + '">' + name + '</a>' + " " + '<img src="' + rating + '"></li><br>';

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
    var searchedFor = $('input').val();
    $yelpResults.append('<li><h3>Oh no! We can\'t seem to find anything for <span>' + searchedFor + '</span>.</h3><p>Try searching something else.</p></li>');

    //	Use google map api to clear the markers on the map
    google.maps.event.addDomListener(window, 'load', googleMarkers(markers));
  }
  var li = $("li");
  li.click(function() {
    $(this).addClass("selected");
  })
}

initMap();
Yelp('60622', 'Bars');
