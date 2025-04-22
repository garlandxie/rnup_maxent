// Import dataset 
var soil_water = ee.Image('OpenLandMap/SOL/SOL_WATERCONTENT-33KPA_USDA-4B1C_M/v01');
var soil_clay = ee.Image("OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02")
var soil_ph = ee.Image("OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02")
var soil_sand = ee.Image("OpenLandMap/SOL/SOL_SAND-WFRACTION_USDA-3A1A1A_M/v02")

// Clip boundary 
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
          
var sw_to = soil_water.select('b30').clip(geometry)
var sc_to = soil_clay.select('b30').clip(geometry)
var ph_to = soil_ph.select('b30').clip(geometry)
var sand_to = soil_sand.select('b30').clip(geometry)
// Import digital surface model 
var dataset = ee.ImageCollection('JAXA/ALOS/AW3D30/V3_2');
var elevation = dataset.select('DSM');

// Reproject an image mosaic using a projection from one of the image tiles,
// rather than using the default projection returned by .mosaic().
var proj = elevation.first().select(0).projection();
var slopeReprojected = ee.Terrain.slope(elevation.mosaic()
                                 .setDefaultProjection(proj));

// Clip to boundary of Toronto
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
          
var slope_to = slopeReprojected.clip(geometry);

// Visualize
Map.setCenter(-79.72377617187499, 43.864467866301716, 11);
Map.addLayer(slope_to, {min: 0, max: 45}, 'Slope');

// Export to Google Drive
Export.image.toDrive({
  image: slope_to,
  description: 'slope_to_20m_res',
  folder: 'rnup',
  fileFormat: 'GeoTIFF',
  crs: 'EPSG:26917', 
  maxPixels: 209242992,
  scale: 20}  
  );



