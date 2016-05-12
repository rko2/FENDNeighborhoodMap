var listResult = function(data) {
  this.name = ko.observable(data.name),
  this.img = ko.observable(data.image_url),
  this.phone = ko.observable(data.display_phone),
  this.url = ko.observable(data.url),
  this.rating = ko.observable(data.rating_img_url_small),
  this.lat = ko.observable(data.location.coordinate.latitude),
  this.long = ko.observable(data.location.coordinate.longitude),
  this.sniptext = ko.observable(data.snippet_text),
  this.snipimg = ko.observable(data.snippet_image_url),
  this.loc = ko.observable(data.location.display_address);
}

var ajaxResults = ko.observableArray();

var viewModel = function() {
  var self = this;
  // Use observables to dynamically search using input.
  this.term = ko.observable('Bars');
  this.area = ko.observable('Wicker Park');
  // Update search results and map based on input.
  this.updateResults = function() {
    ko.computed(function() {
      initMap(self.area());
      yelp(self.area(), self.term());
    }, self);
  };
};

$('#displaybutton').click(function() {
  $('.results').toggleClass('mobile');
});

var googleSuccess = function() {
  initMap('Wicker Park');
  yelp('Wicker Park', 'Bars');
  ko.applyBindings(new viewModel())
}

var googleError = function() {
  alert("Something went wrong with Google Maps.")
}

var authError = function() {
  alert("Something went wrong with Yelp.")
}
