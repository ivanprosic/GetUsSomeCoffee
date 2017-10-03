var coffeShops;

window.onload = function(){
  handleCoffeeShops('distance');
};

function handleCoffeeShops(sortBy){

    if(!coffeShops){
      getLocation(function(err, lat, lon){
        console.log(lat + ',' + lon);
        if(err){console.log("Failed to get location."); return;}
        getCoffeeShops(lat, lon, function(err,list){
          if(err){console.log("Failed to get coffe shop list."); return;}
          //console.log(list);
          coffeShops = list;
          renderCoffeShops(sortBy);
        });
      });
    }
    else{
      renderCoffeShops(sortBy);
    }
}

function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {callback(null, position.coords.latitude, position.coords.longitude)},
          function() {callback('User denied access to location.')}
        );
    } else {
        callback('GetLocation not supported');
    }
}

function getCoffeeShops(lat, lon, callback){
  var xhr = new XMLHttpRequest();
  var url = 'https://api.foursquare.com/v2/venues/explore';
  var data = {
    client_id: 'SJ2TQJO22BOKXRHPZMS2H14KBCS4YPHNDW0OH31BCMA1OQZO',
    client_secret: 'QADKI0PMPGWWBHBXSTMXPLZEYKO1HKGM5ODVUMBHIR2DM1BA',
    v: '20170801',
    ll: lat+',' + lon,
    query: 'coffee',
    limit: 100
  };

  xhr.open("GET", url+'?'+serializeObjects(data));
  //xhr.setRequestHeader("Content-type", "application/json");

  xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
          //console.log(xhr.responseText);
          //console.log('status200yay');
           var jsn = JSON.parse(xhr.responseText);
           console.log(jsn);
           var list = parseCoffeeShopList(xhr.responseText);
           callback(null, list);
      }
      else{
        //callback("Failed to contact API.");
      }
  }

  xhr.send(data);

}

function getPhoto(venueID, callback){
  var xhr = new XMLHttpRequest();
  var url = 'https://api.foursquare.com/v2/venues/' + venueID + '/photos';

  var data = {
    client_id: 'SJ2TQJO22BOKXRHPZMS2H14KBCS4YPHNDW0OH31BCMA1OQZO',
    client_secret: 'QADKI0PMPGWWBHBXSTMXPLZEYKO1HKGM5ODVUMBHIR2DM1BA',
    v: '20170801'
  };

  xhr.open('GET', url+ '?'+ serializeObjects(data));
  xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
          var images = JSON.parse(xhr.responseText);
          var image = images.response.photos.items[0].prefix + '100x100' +  images.response.photos.items[0].suffix;
          callback(null, {
            id: venueID,
            url: image
          });
      }
  }
    xhr.send();
}

function parseCoffeeShopList(dataText){
  //console.log('handleCoffeeShop');
  var data = JSON.parse(dataText);
  var coffeShopList = [];
  if(!data) return false;
  if(!data.response) return false;
  if(!data.response.groups) return false;
  if(!Array.isArray(data.response.groups)) return false;
  if(data.response.groups.lenght <= 0) return false;

  var list = data.response.groups[0].items;
  //console.log(list);
  for(var i=0; i<list.length; i++){
    coffeShopList.push({
      id: list[i].venue.id,
      distance: list[i].venue.location.distance,
      name: list[i].venue.name,
      photos: list[i].venue.photos,
      priceTear: (list[i].venue.price) ? list[i].venue.price.tier : 0
    });

  }
  return coffeShopList;
}

function renderCoffeShops(){
  coffeShops.sort(function(a, b){
      return a.distance - b.distance;
  });
  console.log(coffeShops);

  //JSON to HTML
  var coffeetable = document.getElementById("coffeetable")
  for(var i=0;i<coffeShops.length;i++){
    getPhoto(coffeShops[i].id, function(err, img){
      console.log(img);
      var imag = document.getElementById(img.id);
      imag.src = img.url;

    });

    var tablerow = document.createElement('tr');

    var colPicture = document.createElement('td');
    colPicture.innerHTML = '<img src="" id="' + coffeShops[i].id + '">';
    tablerow.append(colPicture);

    var colName = document.createElement('td');
    colName.innerHTML = coffeShops[i].name;
    tablerow.append(colName);

    var colDistance = document.createElement('td');
    colDistance.innerHTML = coffeShops[i].distance;
    tablerow.append(colDistance);

    var colDetails = document.createElement('td');
    colDetails.innerHTML = '<a class="btn btn-default btn-xs" href="#" role="button">Link</a>'
    tablerow.append(colDetails);

    coffeetable.append(tablerow);


  }

}

function serializeObjects(data){
  var urlParams = "";
  for (var key in data) {
      if (urlParams != "") {
          urlParams += "&";
      }
      urlParams += key + "=" + encodeURIComponent(data[key]);
  }
  return urlParams;

}
