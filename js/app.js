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


/*document.addEventListener("DOMContentLoaded", function(event) { 
  
});*/