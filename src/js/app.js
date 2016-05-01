var LocationFilters = [
  {
    name: "Stores",
    request: {
      location: {
        lat: 41.908730,
        lng: -87.679385
      },
      radius: 750,
      types: ['store']
    }
  }, {
    name: "Restaurants",
    request: {
      location: {
        lat: 41.908730,
        lng: -87.679385
      },
      radius: 750,
      types: ['restaurant']
    }
  }
];

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.request = ko.observable(data.request);
}

var ViewModel = function() {
  var self = this;

  this.filterlist = ko.observableArray([]);
  LocationFilters.forEach(function(locationitem) {
    self.filterlist.push(new Location(locationitem));
  });

  this.currentfilter = ko.observable(this.filterlist()[0]);

  this.SetPlace = function(clickedPlace) {
    self.currentfilter(clickedPlace);
  };
}

ko.applyBindings(new ViewModel());
