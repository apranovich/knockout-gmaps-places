var map;
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: new google.maps.LatLng(55, 25),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  enableAutocomplete();
}

function enableAutocomplete(){
  var searchInput = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(searchInput, { types: ['(cities)'] });
  autocomplete.bindTo('bounds', map);
  autocomplete.setTypes(['geocode']);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }    
    new Place({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), name: place.name });
  });
}

function Place(place){
  var self = this;
  
  self.lat = ko.observable(place.lat);
  self.lng = ko.observable(place.lng);
  self.name = ko.observable(place.name);
  self.description = ko.observable(place.description);
  
  var placeMarker = function(){
    self.marker = new google.maps.Marker({
      position: new google.maps.LatLng(self.lat(), self.lng()),
      title: self.name(),
      map: map,
      draggable: true
    });

    map.setZoom(6);
    map.setCenter(self.marker.position);

    watchMarkerPosition();
  };

  var watchMarkerPosition = function(){
    google.maps.event.addListener(self.marker, 'drag', function() {
      var pos = self.marker.getPosition();
      self.lat(pos.lat());
      self.lng(pos.lng());
    });
  };

  var addInfoWindow = function(){
    self.infowindow = new google.maps.InfoWindow();
    self.infowindow.setContent('<div><strong>' + place.name + '</strong></div>');
    self.infowindow.open(map, self.marker);

    self.marker.addListener('click', function(){
      self.infowindow.open(map, self.marker);
    });
  }

  placeMarker();
  addInfoWindow();

  viewModel.places.push(self);
}

function ViewModel(){
  self = this;

  self.lat = ko.observable(0);
  self.lng = ko.observable(0);
  self.name = ko.observable("");
  self.places = ko.observableArray([]);
  self.filteredPlaces = ko.observableArray([]);

  self.addPlace = function(){
    new Place({
      lat: parseFloat(self.lat()),
      lng: parseFloat(self.lng()),
      name: self.name()
    });
    self.lat(0);
    self.lng(0);
    self.name("");
  };

  self.search = function(searchForText){
    self.filteredPlaces.removeAll();
    let result = self.places()
      .filter((place) => { 
        return place.name.indexOf(searchForText) !== -1; 
      });
    self.filteredPlaces.push(...result);
  }
}

var viewModel = new ViewModel();
$(document).ready(function(event) { 
  initMap();
  ko.applyBindings(viewModel);
});