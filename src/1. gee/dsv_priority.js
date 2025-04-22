// import DSV prioritization map
var priority = ee.Image("projects/ee-garlandxie/assets/dsv_priority");

// clip bbox to Toronto 
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
          
var priority_to = priority.expression('b(0) <= 7 ? 1 : b(0) > 7 ? 0: 0')
      .clip(geometry);

// visualize
Map.addLayer(priority_to, {min: 0, max: 1}, 'Prioritization Score');

// export to Google Drive
Export.image.toDrive({
  image: priority_to,
  description: 'dsv_priority_to_20m_res',
  folder: 'rnup',
  fileFormat: 'GeoTIFF',
  crs: 'EPSG:26917',
  maxPixels: 654958084580,
  scale: 20
})