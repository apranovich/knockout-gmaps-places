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

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.setTypes(['geocode']);

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    });
    marker.setPosition(place.geometry.location);
    map.setZoom(6);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);

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

    watchMarkerPosition();
  };

  var watchMarkerPosition = function(){
    google.maps.event.addListener(self.marker, 'drag', function() {
      var pos = self.marker.getPosition();
      self.lat(pos.lat());
      self.lng(pos.lng());
    });
  };

  placeMarker();
}

function ViewModel(){
  self = this;

  self.lat = ko.observable(0);
  self.lng = ko.observable(0);
  self.name = ko.observable("");
  self.places = ko.observableArray([]);
  self.filteredPlaces = ko.observableArray([]);

  self.addPlace = function(){
    self.places.push(new Place({
      lat: self.lat(),
      lng: self.lng(),
      name: self.name()
    }));
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

$(document).ready(function(event) { 
  initMap();
  ko.applyBindings(new ViewModel());
});