// Import landcover data
var dataset = ee.ImageCollection('ESA/WorldCover/v100').first()
          
// clip by bbox
//dataset = dataset.clip(geometry);
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
          
var lc_to = dataset.clip(geometry)

// Visualize 
var visualization = {
  bands: ['Map'],
};

Map.addLayer(lc_to, visualization, 'Landcover');
Map.centerObject(lc_to);

// Export to Google Drive
Export.image.toDrive({
  image: lc_to,
  description: 'landcover_to_20m_res',
  folder: 'rnup',
  fileFormat: 'GeoTIFF',
  crs: 'EPSG:26917',
  maxPixels: 654958084580,
  scale: 20
})