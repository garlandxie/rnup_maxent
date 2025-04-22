var dataset = ee.Image('projects/ee-garlandxie/assets/ontario_wspd_10m');

// Clip to boundary of TO
var geometry = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-79.7498228529384, 44.020691567917595],
          [-79.7498228529384, 43.60348897845667],
          [-79.01648545059464, 43.60348897845667],
          [-79.01648545059464, 44.020691567917595]]], null, false);
          
var wind_to = dataset.clip(geometry);

// Visualize
var wind_vis = {
  min: 0.854656457901001,
  max: 12.806132316589355
};
Map.setCenter(-79.3832, 43.6532, 9);
Map.addLayer(wind_to, wind_vis);

// Export to Google Drive
Export.image.toDrive({
  image: wind_to,
  folder: "rnup",
  crs: 'EPSG:26917',
  description: 'wind_to_20m_res',
  maxPixels: 209242992,
  scale: 20
});

