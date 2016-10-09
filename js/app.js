var Map = (function(){
  let map;

  return {
    init: function(){
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.397, lng: 150.644},
        zoom: 4
      });
      let marker = Map.addMarker(53.9, 27.5667, "Minsk");
      let latLng = marker.getPosition();
      map.setCenter(latLng);
    },
    addMarker: function(lat, lng, name){
      return new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        title: name
      });
    }
  }
})();

function PlaceModel(place){
  var self = this;
  self.lonLat = ko.observable({lat: place.lat, lng: place.lng});
  self.name = ko.observable(place.name);
  self.description = ko.observable(place.description);
}

function ViewModel(){
  self = this;
  self.places = ko.observableArray([]);
  self.filteredPlaces = ko.observableArray([]);

  self.addPlace = function(place){
    self.places.push(new PlaceModel(place));
    Map.addMarker(place.lat, place.lng, place.name);
  };

  //self.addPlace({lat: 53.9, lng: 27.5667, name: "Minsk, Belarus"});

  self.search = function(searchForText){
    self.filteredPlaces.removeAll();
    let result = self.places()
      .filter((place) => { 
        return place.name.indexOf(searchForText) !== -1; 
      });
    self.filteredPlaces.push(...result);
  }
}

ko.applyBindings(new ViewModel());