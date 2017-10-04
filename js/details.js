var clientId = 'MAZ2HDYFRUBAE25PQQEUIY0XCEE1SZH1Q55MZAFL4CVRZIJL';
var clientSecret = 'VW44SF5S2MQZ3CEH4MAZ4FJNNVR5LH4IIPBQZJK1GLO335O5';
var currentSlide = 0;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

console.log(getParameterByName('id'));

function getDetails(id, callback){
  var xhr = new XMLHttpRequest();
  var url = 'https://api.foursquare.com/v2/venues/' + id;

  var data = {
    client_id: clientId,
    client_secret: clientSecret,
    v: '20170801'
  };

  xhr.open('GET', url+ '?'+ serializeObjects(data));
  xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
          var details = JSON.parse(xhr.responseText);
          callback(null, details);
      }
  }
    xhr.send();
}

getDetails(getParameterByName("id"), function(err, info){
    if(err){
      console.log(error);
      return;
    }
    handleImages(info.response.venue.photos.groups[0].items);
    renderPlaceName(info.response.venue.name);
    var placeDistance = getParameterByName("distance");
    renderPlaceDistance(placeDistance);
    renderTips(info.response.venue.tips.groups[0].items);
    renderPrice(info.response.venue.price.tier);
    console.log(info);
});

function renderPlaceName(placeName){
  document.getElementById("placeName").innerHTML = placeName;
}

function renderTips(tips){
  var ulTips = document.getElementById("tips");
  ulTips.innerHTML = "";
  for(var i=0; i<tips.length; i++){
    ulTips.innerHTML += "<li>" + tips[i].text + "</li>";
  }
}

function handleImages(images){
  currentSlide = 0;
  var divSlide = document.getElementById("imageSlider");
  divSlide.innerHTML = "";
  if(images.length > 10){
    images = images.splice(0,10);
  }
  var imgSlider = document.createElement('img');
  imgSlider.src = images[0].prefix + '500x500' + images[0].suffix;
  divSlide.append(imgSlider);
  var slider = setInterval(function(){
    currentSlide++;
    if(currentSlide>images.length-1){
      currentSlide = 0;
    }
    imgSlider.src = images[currentSlide].prefix+ "500x500" + images[currentSlide].suffix;
  }, 5000);
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

function renderPlaceDistance(placeDistance){
  document.getElementById("showDistance").innerHTML = placeDistance + " m";
}

function renderPrice(price){
  document.getElementById("showPrice").innerHTML = price + " $";
}
