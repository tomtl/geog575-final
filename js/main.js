main()

function main(){
    // function that runs everything
    const datasource = "data/crimes_2016_district1.geojson";
    var map = createMap();
    var data = getData(datasource, map);
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
        center: [41.88, -87.6],
        zoom: 13,
        layers: [tileStamen]
    });

    // add basemap control
    L.control.layers(baseTilesets).addTo(map);

    return map;
};

//function to retrieve the data and place it on the map
function getData(datasource, map){

    //load the data
    let data = $.ajax(datasource, {
        dataType: "json",
        success: function(response){
            // return response;
            createSymbols(response, map);
        }
    });
};

// proportion circle markers
function createSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        // filter: function(feature, layer) {
        //     if (feature.properties.Year == year) {
        //         return true;
        //     }
        // },
        pointToLayer: function(feature, latlng) {
            return pointToLayer(feature, latlng)
        }
    }).addTo(map);
};

// convert markets to circle markets
function pointToLayer(feature, latlng) {
    // let attribute = "total";

    // marker options
    let options = {
        radius: 8,
        fillColor: "#ffff00",
        color: "#ff0000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        radius: 1.0
    };

    let layer = L.circleMarker(latlng, options);

    // var popup = new Popup(feature, attributes, year, layer, attribute);
    // popup.bindToLayer();

    // layer.on({
    //     mouseover: function(){
    //         this.openPopup();
    //     },
    //     mouseout: function(){
    //         this.closePopup();
    //     },
    //     click: function(){
    //       $("#panel").html(popup.panelContent);
    //     }
    // })
    return layer;
};
