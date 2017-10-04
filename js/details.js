var clientId = 'MAZ2HDYFRUBAE25PQQEUIY0XCEE1SZH1Q55MZAFL4CVRZIJL';
var clientSecret = 'VW44SF5S2MQZ3CEH4MAZ4FJNNVR5LH4IIPBQZJK1GLO335O5';

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
    console.log(info);
});

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
