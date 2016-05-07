var ViewModel = function() {
  var self = this;

  this.Term = ko.observable('Tattoo Shops');

  this.updateResults = function(searched) {
    ko.computed(function() {
      Yelp('60622', self.Term());
    }, self)
  };
}

ko.applyBindings(new ViewModel());
