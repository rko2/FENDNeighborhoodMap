var ViewModel = function() {
  var self = this;

  this.Term = ko.observable('Bars');

  this.updateResults = function(searched) {
    ko.computed(function() {
      Yelp('60622', self.Term());
    }, self)
  }
}

$('#displaybutton').click(function() {
  $('.results').toggleClass('mobile');
})

ko.applyBindings(new ViewModel());
