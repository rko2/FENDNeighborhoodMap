var ajaxResults,filteredResults,viewModel=function(){var a=this;ajaxResults=ko.observableArray([]),filteredResults=ko.observableArray([]),this.term=ko.observable("Bars"),this.area=ko.observable("Wicker Park"),this.query=ko.observable(""),this.highlightOn=function(a){a.highlighted(!0)},this.highlightOff=function(a){a.highlighted(!1)},this.openWindow=function(a){makeInfoWindowFromList(a)},this.updateResults=function(){ko.computed(function(){initMap(a.area()),yelp(a.area(),a.term())},a)},this.filter=function(){var b=a.query().toLowerCase();a.query()&&nameMatch(b)},this.clearFilter=function(){a.query(""),listReset(),markerReset()}};$(".DisplayButton").click(function(){$(".Results").toggleClass("Mobile")});var googleSuccess=function(){initMap("Wicker Park"),yelp("Wicker Park","Bars"),ko.applyBindings(new viewModel)},googleError=function(){alert("Something went wrong with Google Maps.")},authError=function(){alert("Something went wrong with Yelp.")};