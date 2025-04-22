# libraries --------------------------------------------------------------------
library(rgbif)    # for querying GBIF records
#library(usethis) # for getting GBIF credentials
library(here)     # for creating relative file-paths
library(sf)       # for manipulating geospatial files
library(wk)       # for manipulating WTK polygons - needed for GBIF queries
library(dplyr)
library(CoordinateCleaner)

# import -----------------------------------------------------------------------

## get Toronto green space shapefiles ------------------------------------------
coords <- matrix(
  c(
    -79.7498228529384, 44.020691567917595,
    -79.7498228529384, 43.60348897845667,
    -79.01648545059464, 43.60348897845667,
    -79.01648545059464, 44.020691567917595
  ),
  ncol = 2, 
  byrow = TRUE
)

## get GBIF records ------------------------------------------------------------
keys_id <- name_backbone_checklist(
  c("Vincetoxicum rossicum", "Cynanchum rossicum")
)

# create WTK polygon of the City of Toronto boundary
# this polygon should reduce the number of imported queries from GBIF
points_sf <- st_as_sf(data.frame(lon = coords[,1], lat = coords[,2]),
                      coords = c("lon", "lat"), crs = 4326)
  

bbox <- st_bbox(points_sf)

wkt_to_boundary <- bbox %>%
  sf::st_as_sfc() %>%
  sf::st_as_text() %>%
  wk::wkt() %>%
  wk::wk_orient()

# run GBIF query from API
rgbif::occ_download(
  pred_in("speciesKey", keys_id$speciesKey),
  pred("hasGeospatialIssue", FALSE),
  pred("hasCoordinate", TRUE),
  pred("occurrenceStatus","PRESENT"), 
  pred_within(wkt_to_boundary)
)

# download queried occurrence record
gbif_occ <- occ_download_get(
  key = '0010177-250415084134356',
  path = here("data", "input_data", "occ_recs_gbif"),
  overwrite = TRUE
) %>%
  occ_download_import(
    select = c(
      "gbifID", 
      "occurrenceID", 
      "occurrenceStatus",
      "year", 
      "decimalLatitude", 
      "decimalLongitude",
      "coordinateUncertaintyInMeters",
      "species", 
      "acceptedScientificName")
  )


# clean data -------------------------------------------------------------------

## geospatial coordinates ------------------------------------------------------

# GBIF
gbif_occ_clean <- gbif_occ %>%
  
  # remove geodefault values
  dplyr::filter(!coordinateUncertaintyInMeters %in% c(301,3036,999,9999)) %>%
  
  # get coordinate accuracy of 10 m or below
  dplyr::filter(coordinateUncertaintyInMeters <= 20) %>%
  dplyr::filter(!is.na(coordinateUncertaintyInMeters))


# save to disk -----------------------------------------------------------------

write.csv(
  x = gbif_occ_clean, 
  file = here(
    "data", "intermediate_data", "occ_tidy.csv")
)
