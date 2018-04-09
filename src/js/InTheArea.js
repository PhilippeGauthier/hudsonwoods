if ($('#in-the-area-map').length) {
var map = L.map('map', {
    center: [41.77197384322616, -74.20966662406921],
    zoom: 10,
    scrollWheelZoom: false
});


L.tileLayer('https://a.tiles.mapbox.com/v3/sandersonj.i245n6m6/{z}/{x}/{y}.png', {
  maxZoom: 18,
  id: 'examples.map-20v6611k'
}).addTo(map);

//array to store layers for each feature type
var mapLayerGroups = [];

// Set Global Popup Options
var popupOptions = {
  maxWidth: 400,
  keepInView: true,
  closeButton: true,
  autoPanPadding: [30, 30]
};

// Create Activity Specific Panes For Filtering
var pane1 = map.createPane('itaSleep ita');
var pane2 = map.createPane('itaEat ita');
var pane3 = map.createPane('itaSip ita');
var pane4 = map.createPane('itaSwing ita');
var pane5 = map.createPane('itaSwim ita');
var pane6 = map.createPane('itaTrail ita');
var pane7 = map.createPane('itaSki ita');
var pane8 = map.createPane('itaCulture ita');
var pane9 = map.createPane('itaPick ita');
var pane10 = map.createPane('itaMind ita');
var pane11 = map.createPane('itaHW ita');



// Activate Each Set of Activities

var hwIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/hw_logo.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
});


function highlightFeaturehw(e) {
    var layer = e.target;
    layer.setIcon(hwIcon);
}

function resetHighlighthw(e) {
  var layer = e.target;
    layer.setIcon(hwIcon);
}

function resetMapSleep(e) {
  map.fitBounds(itaSleep,{
    padding: [50,50]
  });
}

function onEachFeaturehw(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties;
  }

  layer.bindPopup(popupContent,popupOptions);


  // layer.setIcon(grayhwIcon);
  layer.on({
    mouseover: highlightFeaturehw,
    mouseout: resetHighlighthw,   
    popupclose: resetMapSleep 
  });
  // map.on({click: resetHighlighthw});
}

var itahw = L.geoJson([itaHW], {

  style: function (feature) {
    return feature.properties;
  },

  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: hwIcon});
  },
  onEachFeature: onEachFeaturehw,


});
var hwBounds = itahw.getBounds();
itahw.addTo(map);








var graySleepIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_sleep.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorSleepIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_sleep.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});


function highlightFeatureSleep(e) {
    var layer = e.target;
    layer.setIcon(colorSleepIcon);
}

function resetHighlightSleep(e) {
  var layer = e.target;
    layer.setIcon(graySleepIcon);
}

function resetMapSleep(e) {
  map.fitBounds(itaSleep,{
    padding: [50,50]
  });
}




function onEachFeatureSleep(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  if (feature.properties && feature.properties.popupContent) {
    popupContent += feature.properties;
  }

  layer.bindPopup(popupContent,popupOptions);


  // layer.setIcon(graySleepIcon);
  layer.on({
    mouseover: highlightFeatureSleep,
    mouseout: resetHighlightSleep,   
    popupclose: resetMapSleep 
  });
  // map.on({click: resetHighlightSleep});
}

var itaSleep = L.geoJson([itaSleep], {

  style: function (feature) {
    return feature.properties;
  },

  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaSleep ita', icon: graySleepIcon});
  },
  onEachFeature: onEachFeatureSleep,


});
// var sleepBounds = itaSleep.getBounds();
itaSleep.addTo(map);







var grayCultureIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_culture.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorCultureIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_culture.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureCulture(e) {
    var layer = e.target;
    layer.setIcon(colorCultureIcon);
}

function resetHighlightCulture(e) {
  var layer = e.target;
    layer.setIcon(grayCultureIcon);
}

function resetMapCulture(e) {
  map.fitBounds(itaCulture,{
    padding: [50,50]
  });
}


function onEachFeatureCulture(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(grayCultureIcon);
  layer.on({
    mouseover: highlightFeatureCulture,
    mouseout: resetHighlightCulture,   
    popupclose: resetMapCulture 
  });
  // map.on({click: resetHighlightCulture});
}

var itaCulture = L.geoJson([itaCulture], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaCulture ita', icon: grayCultureIcon});

  },
  onEachFeature: onEachFeatureCulture

});
var CultureBounds = itaCulture.getBounds();
itaCulture.addTo(map);







var grayEatIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_eat.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorEatIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_eat.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureEat(e) {
    var layer = e.target;
    layer.setIcon(colorEatIcon);
}

function resetHighlightEat(e) {
  var layer = e.target;
    layer.setIcon(grayEatIcon);
}

function resetMapEat(e) {
  map.fitBounds(itaEat,{
    padding: [50,50]
  });
}

function onEachFeatureEat(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(grayEatIcon);
  layer.on({
    mouseover: highlightFeatureEat,
    mouseout: resetHighlightEat,   
    popupclose: resetMapEat 
  });
  // map.on({click: resetHighlightEat});
}

var itaEat = L.geoJson([itaEat], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaEat ita', icon: grayEatIcon});

  },
  onEachFeature: onEachFeatureEat

});
var EatBounds = itaEat.getBounds();
itaEat.addTo(map);









var grayMindIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_mind-body.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorMindIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_mind-body.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureMind(e) {
    var layer = e.target;
    layer.setIcon(colorMindIcon);
}

function resetHighlightMind(e) {
  var layer = e.target;
    layer.setIcon(grayMindIcon);
}

function resetMapMind(e) {
  map.fitBounds(itaMind,{
    padding: [50,50]
  });
}

function onEachFeatureMind(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(grayMindIcon);
  layer.on({
    mouseover: highlightFeatureMind,
    mouseout: resetHighlightMind,   
    popupclose: resetMapMind 
  });
  // map.on({click: resetHighlightMind});
}

var itaMind = L.geoJson([itaMind], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaMind ita', icon: grayMindIcon});

  },
  onEachFeature: onEachFeatureMind

});
var MindBounds = itaMind.getBounds();
itaMind.addTo(map);






var grayPickIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_pick-grow.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorPickIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_pick-grow.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeaturePick(e) {
    var layer = e.target;
    layer.setIcon(colorPickIcon);
}

function resetHighlightPick(e) {
  var layer = e.target;
    layer.setIcon(grayPickIcon);
}

function resetMapPick(e) {
  map.fitBounds(itaPick,{
    padding: [50,50]
  });
}

function onEachFeaturePick(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(grayPickIcon);
  layer.on({
    mouseover: highlightFeaturePick,
    mouseout: resetHighlightPick,   
    popupclose: resetMapPick 
  });
  // map.on({click: resetHighlightPick});
}

var itaPick = L.geoJson([itaPick], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaPick ita', icon: grayPickIcon});

  },
  onEachFeature: onEachFeaturePick

});
var PickBounds = itaPick.getBounds();
itaPick.addTo(map);






var graySipIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_sip.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorSipIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_sip.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureSip(e) {
    var layer = e.target;
    layer.setIcon(colorSipIcon);
}

function resetHighlightSip(e) {
  var layer = e.target;
    layer.setIcon(graySipIcon);
}

function resetMapSip(e) {
  map.fitBounds(itaSip,{
    padding: [50,50]
  });
}

function onEachFeatureSip(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(graySipIcon);
  layer.on({
    mouseover: highlightFeatureSip,
    mouseout: resetHighlightSip,   
    popupclose: resetMapSip 
  });
  // map.on({click: resetHighlightSip});
}

var itaSip = L.geoJson([itaSip], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaSip ita', icon: graySipIcon});

  },
  onEachFeature: onEachFeatureSip

});
var SipBounds = itaSip.getBounds();
itaSip.addTo(map);





var graySkiIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_ski.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorSkiIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_ski.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});




function highlightFeatureSki(e) {
    var layer = e.target;
    layer.setIcon(colorSkiIcon);
}

function resetHighlightSki(e) {
  var layer = e.target;
    layer.setIcon(graySkiIcon);
}

function resetMapSki(e) {
  map.fitBounds(itaSki,{
    padding: [50,50]
  });
}

function onEachFeatureSki(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(graySkiIcon);
  layer.on({
    mouseover: highlightFeatureSki,
    mouseout: resetHighlightSki,   
    popupclose: resetMapSki 
  });
  // map.on({click: resetHighlightSki});
}

var itaSki = L.geoJson([itaSki], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaSki ita', icon: graySkiIcon});

  },
  onEachFeature: onEachFeatureSki

});
var SkiBounds = itaSki.getBounds();
itaSki.addTo(map);





var graySwimIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_swim.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorSwimIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_swim.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureSwim(e) {
    var layer = e.target;
    layer.setIcon(colorSwimIcon);
}

function resetHighlightSwim(e) {
  var layer = e.target;
    layer.setIcon(graySwimIcon);
}

function resetMapSwim(e) {
  map.fitBounds(itaSwim,{
    padding: [50,50]
  });
}

function onEachFeatureSwim(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(graySwimIcon);
  layer.on({
    mouseover: highlightFeatureSwim,
    mouseout: resetHighlightSwim,   
    popupclose: resetMapSwim 
  });
  // map.on({click: resetHighlightSwim});
}

var itaSwim = L.geoJson([itaSwim], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaSwim ita', icon: graySwimIcon});

  },
  onEachFeature: onEachFeatureSwim

});
var SwimBounds = itaSwim.getBounds();
itaSwim.addTo(map);





var graySwingIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_swing.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorSwingIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_swing.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureSwing(e) {
    var layer = e.target;
    layer.setIcon(colorSwingIcon);
}

function resetHighlightSwing(e) {
  var layer = e.target;
    layer.setIcon(graySwingIcon);
}

function resetMapSwing(e) {
  map.fitBounds(itaSwing,{
    padding: [50,50]
  });
}

function onEachFeatureSwing(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(graySwingIcon);
  layer.on({
    mouseover: highlightFeatureSwing,
    mouseout: resetHighlightSwing,   
    popupclose: resetMapSwing 
  });
  // map.on({click: resetHighlightSwing});
}

var itaSwing = L.geoJson([itaSwing], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaSwing ita', icon: graySwingIcon});

  },
  onEachFeature: onEachFeatureSwing

});
var SwingBounds = itaSwing.getBounds();
itaSwing.addTo(map);






var grayTrailIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/gray_trail.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

var colorTrailIcon = L.icon({
    iconUrl: 'assets/img/in-the-area/icons/color_trail.png',
    iconSize:     [28, 40], // size of the icon
    iconAnchor:   [14, 40], // point of the icon which will correspond to marker's location    
    popupAnchor:  [0, 10] // point from which the popup should open relative to the iconAnchor
});

function highlightFeatureTrail(e) {
    var layer = e.target;
    layer.setIcon(colorTrailIcon);
}

function resetHighlightTrail(e) {
  var layer = e.target;
    layer.setIcon(grayTrailIcon);
}

function resetMapTrail(e) {
  map.fitBounds(itaTrail,{
    padding: [50,50]
  });
}

function onEachFeatureTrail(feature, layer) {

  var popupContent = 

  "<div class='card area " + feature.properties.classType + "'" + ">" + 
  "<h4>" + "<img src=" + feature.properties.classIcon +  ">" + feature.properties.activity + "</h4>" +
  "<h2>" + feature.properties.activityTitle + "</h2>" +
  "<img src=" + feature.properties.image +  ">" + 
  "<p>" + feature.properties.activityDescription + "</p>" +
  "<a target=_blank href=" + feature.properties.website + ">" + feature.properties.website + "</a>" +
  "</div>";

  layer.bindPopup(popupContent,popupOptions);
  // layer.setIcon(grayTrailsIcon);
  layer.on({
    mouseover: highlightFeatureTrail,
    mouseout: resetHighlightTrail,   
    popupclose: resetMapTrail 
  });
  // map.on({click: resetHighlightTrail});
}

var itaTrail = L.geoJson([itaTrail], {

  style: function (feature) {
    return feature.properties;
  },

  
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {pane: 'itaTrail ita', icon: grayTrailIcon});

  },
  onEachFeature: onEachFeatureTrail

});
var TrailBounds = itaTrail.getBounds();
itaTrail.addTo(map);







$('.ita-pane').addClass('active');
$('#all').addClass('active');

$('.markers').click(function(){
  $('.ita-pane').removeClass('active');
  $('.markers').removeClass('active');
  $(this).addClass('active');
  map.closePopup()

});

$( "#all" ).click(function() {
  $('.ita-pane').addClass('active');
  map.setView(new L.LatLng(41.77197384322616, -74.20966662406921), 10)
});



$( "#sleep" ).click(function() {
  $('.leaflet-itaSleep').addClass('active');
  map.fitBounds(itaSleep,{
    padding: [50,50]
  });
});

$( "#eat" ).click(function() {
  $('.leaflet-itaEat').addClass('active');
  map.fitBounds(itaEat,{
    padding: [50,50]
  });
});

$( "#sip" ).click(function() {
  $('.leaflet-itaSip').addClass('active');
  map.fitBounds(itaSip,{
    padding: [50,50]
  });
});

$( "#culture" ).click(function() {
  $('.leaflet-itaCulture').addClass('active');
  map.fitBounds(itaCulture,{
    padding: [50,50]
  });
});

$( "#swing" ).click(function() {
  $('.leaflet-itaSwing').addClass('active');
  map.fitBounds(itaSwing,{
    padding: [50,50]
  });
});

$( "#ski" ).click(function() {
  $('.leaflet-itaSki').addClass('active');
  map.fitBounds(itaSki,{
    padding: [50,50]
  });
});

$( "#swim" ).click(function() {
  $('.leaflet-itaSwim').addClass('active');
  map.fitBounds(itaSwim,{
    padding: [50,50]
  });
});

$( "#pick-and-grow" ).click(function() {
  $('.leaflet-itaPick').addClass('active');
  map.fitBounds(itaPick,{
    padding: [50,50]
  });
});

$( "#trails" ).click(function() {
  $('.leaflet-itaTrail').addClass('active');
  map.fitBounds(itaTrail,{
    padding: [50,50]
  });
});

$( "#mind-and-body" ).click(function() {
  $('.leaflet-itaMind').addClass('active');
  map.fitBounds(itaMind,{
    padding: [50,50]
  });
});



}
