
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
        center: [41.8, -87.6],
        zoom: 9,
        layers: [tileStamen]
    });

    // add basemap control
    L.control.layers(baseTilesets).addTo(map);


};


//create the map
$(document).ready(createMap);
