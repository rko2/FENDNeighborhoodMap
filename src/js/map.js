// Initialize the map.

var map;
var service;
var allmarkers = [];

function initMap() {
  // Set default center.
  var WickerPark = new google.maps.LatLng(41.908730, -87.679385);

  // Create the map.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: WickerPark,
    zoom: 15,
    disableDoubleClickZoom: true
  });
}

// Create markers to put on the map.
function googleMarkers(place) {
  var infowindow = new google.maps.InfoWindow();
}

function Yelp(around, searchfor) {
  var auth = {
    consumerKey: "PDTwNISGHOMT--mxGVuM9w",
    consumerSecret: "id_cBoLI1WywV1Pgechh_o8qnbE",
    accessToken: "ozDJ035xxr_DrlmWsYJ3s_RDzrDhmgj3",
    // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
    // You wouldn't actually want to expose your access token secret like this in a real application.
    accessTokenSecret: "J7F6MQop0W4yyIcKrM1b7o71A3w",
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
    for (result in results) {
      var business = results[result],
        name = business.name,
        img = business.image_url,
        phone = business.display_phone,
        url = business.url,
        rating = business.rating_img_url_small,
        lat = business.location.coordinate.latitude,
        long = business.location.coordinate.longitude,
        sniptext = business.snippet_text,
        snipimg = business.snippet_img_url,
        loc = business.location.display_address;
      var makelist = '<li><div>';
      makelist += '<img src="' + img + '" height=100 width=100>';
      makelist += '<img src="' + rating + '"></div>';
      makelist += '<h3>' + name + '</h3>';
      makelist += '<p><span>' + loc + '</span></p>';
      makelist += '<p>' + ph + '</p>';
      makelist += '<a href="' + url + '"> Yelp!</a>';
      makelist += '</div></li>';

      listing += makelist;

      // Create the individual marker.
      var marker = [name, phone, lat, long, sniptext, snipimg];

      // Push individual markers into array.
      markers.push(marker);

      // Add results to the list.
      yelpResults.append(listing);

      // Place markers on map with Google Maps.
      google.maps.event.addDomListener(window, 'load', addGoogleMapsMarkers(markers));
    }
  } else {
      var searchedFor = $('input').val();
      $yelpResults.append('<li><h3>Oh no! We can\'t seem to find anything for <span>' + searchedFor + '</span>.</h3><p>Trying searching something else.</p></li>');

      //	Use google map api to clear the markers on the map
      google.maps.event.addDomListener(window, 'load', addGoogleMapsMarkers(markers));
    }
  }

  initMap();
  Yelp('60622', 'Tattoo Shops');
