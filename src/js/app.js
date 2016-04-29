var Locations = [{
  name: "Name1",
  address: "Address1"
},
{
  name: "Name2",
  address: "Address2"
}];

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.address = ko.observable(data.address);
}

var ViewModel = function() {
  var self = this;

  this.placelist = ko.observableArray([]);
  Locations.forEach(function(locationitem) {
    self.placelist.push(new Location(locationitem));
  });
}

ko.applyBindings(new ViewModel());
