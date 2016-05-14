var ajaxResults = ko.observableArray();
var emptyResults = ko.observable(false);

var viewModel = function() {
  var self = this;
  // Use observables to dynamically search using input.
  this.term = ko.observable('Bars');
  this.area = ko.observable('Wicker Park');
  // Toggle whether or not the list item is highlighted, and whether or not info window appears.
  this.highlightOn = function(data) {
    data.highlighted(true);
  }
  this.highlightOff = function(data) {
    data.highlighted(false);
  }
  this.openWindow = function(data) {
    makeInfoWindowFromList(data);
  }
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
