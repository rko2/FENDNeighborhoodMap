var ajaxResults;
var filteredResults;

var viewModel = function() {
  var self = this;
  ajaxResults = ko.observableArray([]);
  filteredResults = ko.observableArray([]);
  // Use observables to dynamically search using input.
  this.term = ko.observable('Bars');
  this.area = ko.observable('Wicker Park');
  this.query = ko.observable('');
  console.log(self.query().toLowerCase());
  // Toggle whether or not the list item is highlighted, and whether or not info window appears.
  this.highlightOn = function(data) {
    data.highlighted(true);
  };
  this.highlightOff = function(data) {
    data.highlighted(false);
  };
  this.openWindow = function(data) {
    makeInfoWindowFromList(data);
  };
  // Update search results and map based on input.
  this.updateResults = function() {
    ko.computed(function() {
      initMap(self.area());
      yelp(self.area(), self.term());
    }, self);
  };
  this.filter = function() {
    var test = self.query().toLowerCase();
    if (self.query()) {
      nameMatch(test);
    }
  };
  this.clearFilter = function() {
    self.query('');
    listReset();
    markerReset();
  }
};


$('.DisplayButton').click(function() {
  $('.Results').toggleClass('Mobile');
});

var googleSuccess = function() {
  initMap('Wicker Park');
  yelp('Wicker Park', 'Bars');
  ko.applyBindings(new viewModel());
}

var googleError = function() {
  alert("Something went wrong with Google Maps.")
}

var authError = function() {
  alert("Something went wrong with Yelp.")
}
