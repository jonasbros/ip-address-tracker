var mymap = L.map('map', { 
    zoomControl: false,
}
).locate({ setView: true });

// 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);

var marker = null;

mymap.on('load', () => {
    var myIcon = L.icon({
        iconUrl: './assets/icon-location.svg',
        iconSize: [46, 56],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

    marker = L.marker(mymap.getCenter(), { icon: myIcon }).addTo(mymap);
    mymap.setZoom(14);
});

let searchText = document.querySelector('#ip-input');
let search = document.querySelector("#search-btn");

let ipifyUrl = 'https://geo.ipify.org/api/v1?apiKey=at_u4q2r5FqJXtoRzApieK9G8vy2ynhx';

let IPResult = document.querySelector('#result__ip-address p'); 
let locationResult = document.querySelector('#result__location p'); 
let timezoneResult = document.querySelector('#result__timezone p'); 
let ISPResult = document.querySelector('#result__isp p'); 

//first visit / every refresh, get client's ip;
getIpify(ipifyUrl);


search.addEventListener( 'mouseup', (e) => { 
    execute();
} );    

window.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      execute();
    }
});

function execute() {
    if( !searchText.value ) return;

    if( ValidateIPaddress(searchText.value) ) {
        ipifyUrl = 'https://geo.ipify.org/api/v1?apiKey=at_u4q2r5FqJXtoRzApieK9G8vy2ynhx&ipAddress='+searchText.value;
    }else {
        ipifyUrl = 'https://geo.ipify.org/api/v1?apiKey=at_u4q2r5FqJXtoRzApieK9G8vy2ynhx&domain='+searchText.value;
    }

    getIpify(ipifyUrl);
}

///////////////////////
function getIpify(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(xhttp.responseText);
            //change text
            IPResult.innerHTML = result.ip;
            locationResult.innerHTML = `${result.location.city}, ${result.location.region} ${result.location.postalCode}`;
            timezoneResult.innerHTML = result.location.timezone;
            ISPResult.innerHTML = result.isp;
            //pan map to location
            let newLatlng = [result.location.lat, result.location.lng];
            mymap.panTo(newLatlng);
            marker.setLatLng(newLatlng);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}





function ValidateIPaddress(ipAddress) {
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if(ipAddress.match(ipformat)){
        return true;
    }    
    return false;
 }

