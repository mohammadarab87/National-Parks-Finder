
// Create a new instance of L.tileLayer
var hybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

var street = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

// Create a baseMaps object.
var baseMaps = {
    "Hybrid": hybrid,
    "Satellite": satellite,
    "Street": street,
    "Topographie" : topo
};


// Create a new instance of L.map
var map = L.map('map').setView([37.09, -95.71], 5);

// Add the tile layer to the map
hybrid.addTo(map);

// Load the CSV file with Papa Parse
Papa.parse("statics/data/merged_df.csv", {
  header: true,
  download: true,
  complete: function(results) {
    // Create a GeoJSON object
    let geojson = {
      type: "FeatureCollection",
      features: []
    };
    
    // Loop through the rows of the CSV and add each row as a feature to the GeoJSON object
    for (let i = 0; i < results.data.length; i++) {
      var feature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(results.data[i].latitude),
            parseFloat(results.data[i].longitude)
          ]
        },
        properties: results.data[i]
      };
      geojson.features.push(feature);
    }
    
    // Console log the geoJSON object
    console.log(geojson);

    // Create layer groups for camping and parks markers
var campingMarkers = L.markerClusterGroup();
var parkMarkers = L.layerGroup();

    // CAMPING
    

    // Define the camping icon using L.icon()
var campingIcon = L.icon({
    iconUrl: 'Image/Camping.png',
    iconSize: [15, 15], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
});

// Create an empty object to store unique camp names
var uniqueCamps = {};
// Loop through the features of the geojson object and add a marker to the map for each feature
geojson.features.forEach(function(feature) {
    var campName = feature.properties.name;
        
        // Check if the camp name is unique
        if (!(campName in uniqueCamps)) {
            uniqueCamps[campName] = true;

    if ((feature.properties.lat_camp!=null)&(feature.properties.lon_camp!=null)){
        var marker = L.marker([feature.properties.lat_camp, feature.properties.lon_camp], {
            icon: campingIcon // set the custom icon as the marker's icon
        }).addTo(campingMarkers);
        
        // Add a popup to the marker with some information about the feature
        marker.bindPopup('<b>' + campName + '</b><br>' + feature.properties.states);
        }
        }
    })

        // PARKS 
     // Define the park icon using L.icon()
var parkIcon = L.icon({
    iconUrl: 'Image/parks.png',
    iconSize: [40, 40], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
});

// Loop through the features of the geojson object and add a marker to the map for each feature feature.geometry.coordinates[0], feature.geometry.coordinates[1]
geojson.features.forEach(function(feature) {
    if ((feature.properties.latitude!=null)&(feature.properties.longitude!=null)){
        var marker = L.marker([feature.properties.latitude, feature.properties.longitude], {
            icon: parkIcon // set the custom icon as the marker's icon
        }).addTo(parkMarkers);
        
        // Add a popup to the marker with some information about the feature
        marker.bindPopup('<b>' + feature.properties.fullName + '</b><br>' + feature.properties.states);
        }
    });
    // Create a baseMaps object.
    var overLayers = {"Camp": campingMarkers,
                    "Parks": parkMarkers};

// Add the layer groups to the control layer

L.control.layers(baseMaps, overLayers).addTo(map)

// Define the legend control
var legendControl = L.control({
    position: 'bottomright'
});

// When the control is added to the map
legendControl.onAdd = function(map) {
    // Create the container for the legend
    var div = L.DomUtil.create('div', 'legend');
    
    // Add the legend title
    div.innerHTML += '<h4>Legend</h4>';
    
    // Add the camping icon and label
    div.innerHTML += '<img src="Image/Camping.png" alt="camping icon" width="20" height="20"> Camp Sites<br>';
    
    // Add the park icon and label
    div.innerHTML += '<img src="Image/parks.png" alt="park icon" width="20" height="20"> National Parks<br>';
    
    // Return the container
    return div;
};

// Add the legend control to the map
legendControl.addTo(map);


  }
});





    
        

    //Functions
    function buildParkData(sample) {
        let panel = d3.select('#sample-metadata')
        panel.html('')
        d3.csv('parks_df.csv').then(function (data) {
            let metadata = data.filter(obj => obj['Park Name'] == sample)[0];
            console.log(data.filter(obj => obj['Park Name'] == sample));
            for (item in metadata) {
                panel.append('h6').text(`${item}: ${metadata[item]}`)
            }     
        }
        )  
    }

    function buildAlertData(sample) {
        let alertPanel = d3.select('#sample-alertdata')
        alertPanel.html('')
        d3.csv('alerts_df.csv').then(function (data) {
            let metadata = data.filter(obj => obj['Park Name'] == sample);
            console.log(metadata[0]);
            for (let i = 0; i < metadata.length; i++){
                for (item in metadata[i]) {
                    if (item == 'Alert') {
                        alertPanel.append('h6').text(`${item}: ${metadata[i][item]}`)
                    }
                    else if (item == 'Description'){
                        alertPanel.append('h6').text(`${item}: ${metadata[i][item]}`)
                    }
                    else if (item == 'Date'){
                        alertPanel.append('h6').text(`${item}: ${metadata[i][item]}`)
                    }
            }
            
                
            }     
        }
        )  
    }

function init(){
    let select = d3.select('#selDataset')
    d3.csv('merged_df.csv').then(function (data) {
        //get only one of each park in dropdown
        let parkNames = [];
        for (let i = 0; i < data.length; i++) {
            let currentPark = data[i];
            let currentParkName = currentPark['fullName'];
            const elementExists = parkNames.includes(currentParkName);
            if (!elementExists) {

                parkNames.push(currentParkName);
                
                }
        } 
        //console.log(parkNames);   
         for (let i = 0; i < parkNames.length; i++) {
             select.append('option').text(parkNames[i]).property('value', parkNames[i])
         }
    }
    
    )
    buildParkData('Grand Canyon National Park');
    buildAlertData('Grand Canyon National Park')
}

function optionChanged(sample) {
    buildParkData(sample);
    buildAlertData(sample);  
}
init();

