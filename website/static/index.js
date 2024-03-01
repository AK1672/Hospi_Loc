let map,pos;
window.addEventListener("load", function() {
  document.querySelector(".image-container img").classList.add("fade-in");
});


function deleteNote(noteId) {
  fetch("/delete-note", {
    method: "POST",
    body: JSON.stringify({ noteId: noteId }),
  }).then((_res) => {
    window.location.href = "/";
  });
}

async function showHosp(){
  loc = document.getElementById("Location").value
  var listContainer = document.getElementById("list-container");
  await fetch('https://geocode.maps.co/search?q=New+Delhi&api_key=your_api', {
    method: 'POST',
})
   .then(response => response.json())
   .then(response => { lat = response[0].lat
                      lon = response[0].lon})
  fetch("/show-hosp", {
    method: "POST",
    body: JSON.stringify({ lat: lat, lon : lon }),
  }).then(response => response.json())
  .then(data => {
    listContainer.innerHTML = ""; 
            data.forEach(function(dt) {
                var li = document.createElement("li");
                li.textContent = dt.name;
                listContainer.appendChild(li);
            });
            initMap({
              lat: lat,
              lng: lon,
            })
  });

 
            
}



async function initMap(pos) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

          },
          () => {
            pos = { lat: 28.6139, lng: 77.2090 };
            console.log("Error0");
          },
        );
      }
  
  
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  
  map = new Map(document.getElementById("map"), {
    zoom: 13,
    center: pos,
    mapId: "DEMO_MAP_ID",
  });

  const marker = new AdvancedMarkerElement({
    map: map,
    position: pos,
  });

  for (var i = 0; i < data.length; i++) {
    var mark = new google.maps.Marker({
      position: { lat: data[i].lat, lng: data[i].lng },
      map: map,
      title: data[i].title
    });}
}

initMap(pos);