// Variable to store the layers that the user has selected
var activeLayers = [];
// Global undefined variables for the layers that the user can control
var heatMapLayer;
var crimeLayer;
var censusBlocksLayer;
var mapLayerGroups = [];

main()

function main(){
    // function that runs everything
    const datasource = "data/crimes_2016_district1.geojson";
    var map = createMap();
    addCensusBlocks(map);
    var data = getData(datasource, map);
    addEvents(map);
};

//function to create and add data to the map
function createMap(){

    //load Stamen Toner tile layer
    var tileStamen = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>'
    });

    //load Stamen Toner tile layer
    var tileTerrain = L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>'
    });

    //create TileSets variable for layer control
    var baseTilesets = {
      "Toner": tileStamen,
      "Terrain": tileTerrain
    };

    //create the map
    var map = L.map('mapid', {
        center: [41.86, -87.6],
        zoom: 13,
        layers: [tileStamen]
    });

    // add basemap control
    L.control.layers(baseTilesets).addTo(map);

    //establish variables for bar chart
    let ars = 4;
    let ass = 588;
    let bat = 1319;
    let bur = 204;
    let csa = 55;
    let cda = 727;
    let ctr = 522;
    let dpr = 1615;
    let hom = 9;
    let ht = 1;
    let ipo = 17;
    let int = 7;
    let kid = 7;
    let llv = 8;
    let mvt = 221;
    let nar = 125;
    let ncr = 4;
    let obs = 3;
    let ofc = 29;
    let off = 469;
    let pro = 6;
    let pin = 3;
    let ppv = 74;
    let rob = 444;
    let sof = 39;
    let sta = 7;
    let the = 6261;
    let wvi = 32;

    //call bar chart function on desired variables
    let data = [bat,cda,ctr,dpr,off,rob,the];
    makeBarChart(data);

    return map;
};

//function to retrieve the data and place it on the map
function getData(datasource, map){

    //load the data
    let data = $.ajax(datasource, {
        dataType: "json",
        success: function(response){
            // return response;
            crimeLayer = createSymbols(response, map);
            activeLayers.push(crimeLayer);
            heatMapLayer = createHeatmap(response, map);
            activeLayers.push(heatMapLayer);
        }

    });
};

// proportion circle markers
function createSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    var crimes = L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
            return pointToLayer(feature, latlng)
        },
        onEachFeature: onEachFeature
    })


    function onEachFeature(feature, featureLayer) {
        // Add the crime points as a Layer Group

        //does layerGroup already exist? if not create it and add to map
        let crimeType = feature.properties["Type"];
        let layerGroup = mapLayerGroups[crimeType];

        if (layerGroup === undefined) {
            layerGroup = new L.layerGroup();
            //add the layer to the map
            layerGroup.addTo(map);
            //store layer
            mapLayerGroups[crimeType] = layerGroup;
        };

        //add the feature to the layer
        mapLayerGroups[crimeType].addLayer(featureLayer);
    };

    return crimes;
};

// convert markets to circle markets
function pointToLayer(feature, latlng) {


    // marker options
    let options = {
        radius: 8,
        fillColor: "#ffff00",
        color: "#ff0000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        radius: 2
    };

    let layer = L.circleMarker(latlng, options);


    //create pop-ups
    var popupContent = "<p><b>" + feature.properties.Type + "</b> "
    popupContent += "<p><b>Case Number:</b> " + feature.properties.Case_Numbe + "</p>";

    var date = feature.properties.Date.split(" ")[0]

    popupContent += "<p><b>Date:</b> " + date + "</p>";
    popupContent += "<p><b>Block:</b> " + feature.properties.Block + "</p>";
    popupContent += "<p><b>Description:</b> " + feature.properties.Descriptio + "</p>";


    layer.bindPopup(popupContent);

    //event listeners to open popup on hover
     layer.on({
         click: function(){
             this.openPopup();
         },
         mouseout: function(){
             this.closePopup();
         }
     });
    return layer;

};



//add heat map to map
function createHeatmap(data,map){

    //create array of location points lat/lng/intensity
    var locations = data.features.map(function(rat) {
        var location = rat.geometry.coordinates.reverse();
        location.push(0.5);
        return location;
    });
    //use heatLayer to create heatmap based on locations array
    var heat = L.heatLayer(locations,{radius:10});

    return heat;

};

// Adds the event listeners for the map buttons
function addEvents(map){
    // Variables for DOM buttons
    var heatMapButton = document.getElementById("heatMap");
    var crimeLocationButton = document.getElementById("crime");
    var censusBlocksButton = document.getElementById("censusBlocks");



    // Toggles the layer on and off and toggles the button selected class
    heatMapButton.addEventListener("click", function() {
        this.classList.toggle("selected");
        var layerIndex = activeLayers.indexOf(heatMapLayer);
        if (layerIndex === -1){
            map.addLayer(heatMapLayer)
            activeLayers.push(heatMapLayer);
        }
        else {
            map.removeLayer(heatMapLayer);
            activeLayers.splice(layerIndex,1);
        }
    });

    // Toggles the layer on and off and toggles the button selected class
    crimeLocationButton.addEventListener("click", function() {
        this.classList.toggle("selected");
        var layerIndex = activeLayers.indexOf(crimeLayer);
        if (layerIndex === -1){
            map.addLayer(crimeLayer)
            activeLayers.push(crimeLayer);
        }
        else {
            map.removeLayer(crimeLayer);
            activeLayers.splice(layerIndex,1);
        }
    });

    // Toggles the layer on and off and toggles the button selected class
    censusBlocksButton.addEventListener("click", function() {
        this.classList.toggle("selected");
        var layerIndex = activeLayers.indexOf(censusBlocksLayer);
        if (layerIndex === -1){
            map.addLayer(censusBlocksLayer)
            activeLayers.push(censusBlocksLayer);
        }
        else {
            map.removeLayer(censusBlocksLayer);
            activeLayers.splice(layerIndex,1);
        }
    });

    // crime types and crime button selector names
    let crimeButtons = {
        "crimeSelectorArson": "ARSON",
        "crimeSelectorAssault": "ASSAULT",
        "crimeSelectorBattery": "BATTERY",
        "crimeSelectorBurglary": "BURGLARY",
        "crimeSelectorConcealedCarry": "CONCEALED CARRY LICENSE VIOLATION",
        "crimeSelectorCrimSexualAssault": "CRIM SEXUAL ASSAULT",
        "crimeSelectorCriminalDamage": "CRIMINAL DAMAGE",
        "crimeSelectorCriminalTresspass" : "CRIMINAL TRESPASS",
        "crimeSelectorDeceptivePractice" : "DECEPTIVE PRACTICE",
        "crimeSelectorGambling": "GAMBLING",
        "crimeSelectorHomocide" : "HOMICIDE",
        "crimeSelectorHumanTrafficking" : "HUMAN TRAFFICKING",
        "crimeSelectorInterference" : "INTERFERENCE WITH PUBLIC OFFICER",
        "crimeSelectorIntimidation" : "INTIMIDATION",
        "crimeSelectorKidnapping" : "KIDNAPPING",
        "crimeSelectorLiquor" : "LIQUOR LAW VIOLATION",
        "crimeSelectorMotorVehicleTheft" : "MOTOR VEHICLE THEFT",
        "crimeSelectorNarcotics" : "NARCOTICS",
        "crimeSelectorNonCriminal" : "NON-CRIMINAL",
        "crimeSelectorObscenity" : "OBSCENITY",
        "crimeSelectorChildren" : "OFFENSE INVOLVING CHILDREN",
        "crimeSelectorOtherNarcotic" : "OTHER NARCOTIC VIOLATION",
        "crimeSelectorOtherOffense" : "OTHER OFFENSE",
        "crimeSelectorProstitution" : "PROSTITUTION",
        "crimeSelectorPublicIndecency" : "PUBLIC INDECENCY",
        "crimeSelectorPublicPeaceViolation" : "PUBLIC PEACE VIOLATION",
        "crimeSelectorRobbery" : "ROBBERY",
        "crimeSelectorSexOffense" : "SEX OFFENSE",
        "crimeSelectorStalking" : "STALKING",
        "crimeSelectorTheft" : "THEFT",
        "crimeSelectorWeaponsViolation" : "WEAPONS VIOLATION",
    };


    // crime button listeners

    $('#accordion').accordion({
        active: false,
        collapsible: true
    });

    for (var key in crimeButtons) {
        // loop through the crime types and button names
        if (crimeButtons.hasOwnProperty(key)) {
            //console.log(crimeButtons[key]);

            let crimeSelectorButton = key;
            let crimeType = crimeButtons[key];

            // add click event listener
            document.getElementById(crimeSelectorButton).addEventListener("click", function( event ) {

                // check if layer is added
                if (map.hasLayer(mapLayerGroups[crimeType])) {
                    // remove layer if present
                    map.removeLayer(mapLayerGroups[crimeType]);
                } else if (crimeType in mapLayerGroups) {
                    // add layer if not present but exists in map layer groups
                    map.addLayer(mapLayerGroups[crimeType]);
                } else {
                    // if layer not present in dataset, do nothing and report layer
                    console.log(crimeType + " layer is missing");
                };
            });
        };
    };
};

//function to load and add census block layers
function addCensusBlocks(map){
    const datasource = "data/chicagoCensusBlocks.geojson";

    let data = $.ajax(datasource, {
        dataType: "json",
        success: function(response){
            // return response;
            censusBlocksLayer = createCensusBlocks(response, map);
            activeLayers.push(censusBlocksLayer);
        }

    });
};

function createCensusBlocks(response, map){
    var censusBlocks = L.geoJSON();
    var myStyle = {
      weight: 1
    }
    censusBlocks.addData(response).setStyle(myStyle);

    return censusBlocks;
};



//bar chart function
function makeBarChart(data){
    var ctxB = document.getElementById("barChart").getContext('2d');
    var myBarChart = new Chart(ctxB, {
        type: 'bar',
        data: {
            labels: ["Battery", "Criminal Damage", "Criminal Trespass", "Deceptive Practice", "Other Offense","Robbery","Theft"],
            datasets: [{
                label: '# Crimes',
                data: data,
                backgroundColor: [
                    '#e41a1c',
                    '#377eb8',
                    '#4daf4a',
                    '#984ea3',
                    '#ff7f00',
                    '#ffff33',
                    '#a65628'
                ],
                borderColor: [
                    '#e41a1c',
                    '#377eb8',
                    '#4daf4a',
                    '#984ea3',
                    '#ff7f00',
                    '#ffff33',
                    '#a65628'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            layout: {
                padding: {
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 15
                }
            },
            maintainAspectRatio: false
        }
    });
};
