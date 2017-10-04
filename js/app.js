var coffeShops;
var clientId = 'MAZ2HDYFRUBAE25PQQEUIY0XCEE1SZH1Q55MZAFL4CVRZIJL';
var clientSecret = 'VW44SF5S2MQZ3CEH4MAZ4FJNNVR5LH4IIPBQZJK1GLO335O5';
var sort = 'distance';
var distance = 2000;

document.getElementById("maxdistance").value = 2000;

window.onload = function(){
  handleCoffeeShops();
};

function handleCoffeeShops(){
      getLocation(function(err, lat, lon){
        // console.log(lat + ',' + lon);
        if(err){console.log("Failed to get location."); return;}
        getCoffeeShops(lat, lon, function(err,list){
          if(err){console.log("Failed to get coffe shop list."); return;}
          //console.log(list);
          coffeShops = list;
          renderCoffeShops(sort);
        });
      });
}

function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {callback(null, position.coords.latitude, position.coords.longitude)},
          function() {
            callback('User denied access to location.');
            console.log("User denied access to location.");
            alert("Please enable location.");
          }
        );
    } else {
        callback('GetLocation not supported');
    }
}

function getCoffeeShops(lat, lon, callback){
  var xhr = new XMLHttpRequest();
  var url = 'https://api.foursquare.com/v2/venues/explore';
  var data = {
    client_id: clientId,
    client_secret: clientSecret,
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
    client_id: clientId,
    client_secret: clientSecret,
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
  console.log(data);
  var coffeShopList = [];
  if(!data) return false;
  if(!data.response) return false;
  if(!data.response.groups) return false;
  if(!Array.isArray(data.response.groups)) return false;
  if(data.response.groups.lenght <= 0) return false;

  var list = data.response.groups[0].items;
  //console.log(list);
  //Prikazi radnje koje rade
  //if(list[i].venue.location.distance <= distance && list[i].venue.hour.isOpen){
  for(var i=0; i<list.length; i++){
    if(list[i].venue.location.distance <= distance){
      coffeShopList.push({
        id: list[i].venue.id,
        distance: list[i].venue.location.distance,
        name: list[i].venue.name,
        photos: list[i].venue.photos,
        priceTear: (list[i].venue.price) ? list[i].venue.price.tier : 0
      });
    }

  }
  return coffeShopList;
}

function renderCoffeShops(sortBy){
  coffeShops.sort(function(a, b){
      if(sortBy === 'price'){
        return a.priceTear - b.priceTear;
      }
      else{
        return a.distance - b.distance;
      }
  });
  console.log(coffeShops);

  coffeShops = coffeShops.splice(0,10);

  //JSON to HTML
  var coffeetable = document.getElementById("coffeetable");
  coffeetable.innerHTML = "";
  for(var i=0;i<coffeShops.length;i++){
    getPhoto(coffeShops[i].id, function(err, img){
      console.log(img);
      var imag = document.getElementById(img.id);
      imag.src = img.url;
    });

    var tablerow = document.createElement('tr');

    var colPicture = document.createElement('td');
    colPicture.style.width = '10%';
    colPicture.innerHTML = '<img src="" id="' + coffeShops[i].id + '">';
    tablerow.append(colPicture);

    var colName = document.createElement('td');
    colName.innerHTML = coffeShops[i].name;
    tablerow.append(colName);

    var colDistance = document.createElement('td');
    colDistance.innerHTML = coffeShops[i].distance + ' m';
    tablerow.append(colDistance);

    var colDetails = document.createElement('td');
    colDetails.innerHTML = '<a class="btn btn-default" href="./details.html?id=' + coffeShops[i].id + '&distance=' + coffeShops[i].distance + '" role="button">More information</a>'
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

function onSortClick(sortBy){
  sort = sortBy;
  handleCoffeeShops();
}

function onSetDistance(){
  distance = document.getElementById('maxdistance').value;
  console.log(distance);
  handleCoffeeShops();
}
