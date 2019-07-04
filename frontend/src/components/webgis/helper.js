import proj4 from 'proj4'
import moment from 'moment'


let defined_epsg;

/**
 * This function creates the link that is needed to get the values for a location query or a report.
 * This link is sent to the backend
 * @param {*} area - Active pilot area
 * @param {*} layers - Layers that are relevant for a query
 * @param {*} bounds - Bounds of the map
 * @param {*} size - Size of the map element in px
 * @param {*} coordinates - Coordinates of the queried location (x and y)
 */
export const featureRequest = (area, layers, bounds, size, coordinates) => {

    const epsg = (layers[0].srs === 'EPSG:25833' ? '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs' : '+proj=utm +zone=34 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

    const southWestCorner = proj4(epsg, [bounds[3], bounds[2]]);
    const northEastCorner = proj4(epsg, [bounds[1], bounds[0]]);

    const bbox = southWestCorner[0]+","+southWestCorner[1]+","+northEastCorner[0]+","+northEastCorner[1];
    const width = size[0];
    const height = size[1];

    const pointX = coordinates[0];
    const pointY = coordinates[1];

    let layername = '';
    layers.map(layer => {
        layername = layername + area+":"+layer.uri+","
        defined_epsg = layer.srs
    })
    layername = layername.slice(0, -1);
    if(layers.length === 1) {
        layername= layername + ',general:Pilot_Areas';
    }

    let bodyParams = ''; 
    bodyParams = '&propertyName=';
    layers.map(layer => {
        if(layer.resource_format === 'Shape') {
            if((layer.parent === 'conflict map') || (layer.parent === 'open-loop potential')) {
                bodyParams = bodyParams + '(conflict)';
            }
            else if(layer.parent === 'general information') {
                if(layer.traffic_light_map_open_loop || layer.traffic_light_map_closed_loop) {
                    bodyParams = bodyParams + '(traffic_va)';
                } else {
                    bodyParams = bodyParams + '(conflict)';
                }      
            } else {
                bodyParams = bodyParams + '(value)';
            }
        } else {
            bodyParams = bodyParams + '(value)';
        }
        
    });
    if(layers.length === 1) {
        bodyParams= bodyParams + '(Source)';
    }

    const link = "layers="+layername+"&styles=&srs="+defined_epsg+"&bbox="+bbox+"&width="+width+"&height="+height+"&format=image/png&query_layers="+layername+"&feature_count=100&info_format=application/json&i="+pointX+"&j="+pointY+bodyParams

    return link;
}

/**
 * Get active layers based on the given ones
 * @param  {} layers
 */
export const getActiveLayers = (layers) => {
    let active_layers = [];
    layers.map(layer => {
        if(layer.children.length === 0) {
            active_layers.push(layer)
        } else {
            layer.children.map(child => {
                if(child.children.length > 0) {
                    child.children.map(chi => {
                        active_layers.push(chi)
                    })
                } else {
                    active_layers.push(child)
                }
            })
        }
    })
    return active_layers;
}

/**
 * Compare the layers that exist in the metadata table with the ones that are on the geoserver to decide
 * if layer is added or removed from the web gis
 * @param  {} excellayers
 * @param  {} geoserverlayers
 */
export const compareData = (excellayers, geoserverlayers) => {

    let response = [];

    excellayers.map(layer => {
      if(!layer.model) {
        layer.push = false;
        layer.pull = false;
      }

    })

    response.messages = [];
    response.layers = excellayers;
    geoserverlayers = getActiveLayers(geoserverlayers);
    // If there is no layer in the geoserver, add all layers!
    if(geoserverlayers.length === 0) {
      
        excellayers.map(layer => {
          if(!layer.model) {
            layer.push = true;
            layer.pull = false;
            response.messages.push("The layer '" +layer.filename+ "' will be added to the web GIS.")
          } else {

            if((layer.push) && (layer.pull)) {
              response.messages.push("The layer '" +layer.filename+ "' will be updated on the web GIS.")
            } else {
              if(layer.push) {
                response.messages.push("The layer '" +layer.filename+ "' will be added to the web GIS.")
              }
              if(layer.pull) {
                response.messages.push("The layer '" +layer.filename+ "' will be removed from the web GIS.")
              }
            }
          }
        })
        return response;
    }

    
    // Compare the layers from the excel file with those on the geoserver
    excellayers.map(layer => {
        let findLayerAtGeoserver = geoserverlayers.filter(geolayer => geolayer.filename === layer.filename);
        // Layer does not exist on geoserver yet
        if(findLayerAtGeoserver.length === 0) {
            layer.push = true;
            layer.pull = false;
            response.messages.push("The layer '" +layer.filename+ "' will be added to the web GIS.")
        }

        // Layer was updated
        if(findLayerAtGeoserver.length === 1) {
            let geoserverDate = moment(findLayerAtGeoserver[0].date);
            let excelfileDate = moment(layer.date);
            if(moment(excelfileDate).isAfter(geoserverDate)) {
                layer.push = true;
                layer.pull = false;
                response.messages.push("The layer '" +layer.filename+ "' will be added to the web GIS.")
              } else {
                if((layer.push) && (layer.pull)) {
                  response.messages.push("The layer '" +layer.filename+ "' will be updated on the web GIS.")
                } else {
                  if(layer.push) {
                    response.messages.push("The layer '" +layer.filename+ "' will be added to the web GIS.")
                  }
                  if(layer.pull) {
                    response.messages.push("The layer '" +layer.filename+ "' will be removed from the web GIS.")
                  }
                }
              }
          }

          // Layer was updated
          if(findLayerAtGeoserver.length === 1) {
              let geoserverDate = moment(findLayerAtGeoserver[0].date);
              let excelfileDate = moment(layer.date);

              if(moment(excelfileDate).isAfter(geoserverDate)) {
                  layer.push = true;
                  layer.pull = true;
                  response.messages.push("The layer '" +layer.filename+ "' will be updated on the web GIS.")
              }
          }

      })
      // There are more layers on the geoserver, layer needs to be deleted
      if(excellayers.length < geoserverlayers.length) {
          geoserverlayers.map(layer => {

              let findLayerAtExcelfile = excellayers.filter(geolayer => geolayer.filename === layer.filename);
              if(findLayerAtExcelfile.length === 0) {
                  layer.pull = true;
                  layer.push = false;
                  response.messages.push("The layer '" +layer.filename+ "' will be removed from the web GIS.")
                  response.layers.push(layer);
              }
          })
      }

      if(response.messages.length === 0) {
          response.messages.push("No data has changed, the layers will not be updated in the web gis")
      }
    



    return response;
}
