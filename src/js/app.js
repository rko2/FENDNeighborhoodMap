var ViewModel = function() {
  var self = this;
  // Use observables to dynamically search using input.
  this.Term = ko.observable('Bars');
  this.area = ko.observable('Wicker Park');
  // Update search results and map based on input.
  this.updateResults = function(searched) {
    ko.computed(function() {
      initMap(self.area());
      Yelp(self.area(), self.Term());
    }, self);
  };
};

$('#displaybutton').click(function() {
  $('.results').toggleClass('mobile');
});

ko.applyBindings(new ViewModel());
