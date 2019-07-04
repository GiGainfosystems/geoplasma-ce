import proj4 from 'proj4';

const initialState = [];

/**
 * Reducer for the field measurements
 * @param  {} state=initialState
 * @param  {} action
 */
export const measurements = (state = initialState, action) => {
  switch(action.type) {

      case 'LOAD_MEASUREMENTS_SUCCESS':
          
          const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ";
          action.measurements.map(measured => {
            let utm;
            if(measured.utm_merid === 'UTM 34N') {
              utm = "+proj=utm +zone=34 +ellps=GRS80 +units=m +no_defs ";
            } else {
              utm = "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs ";
            }
            const coordinates = proj4(utm,wgs84,[parseFloat(measured.utm_east), parseFloat(measured.utm_north)]);
            measured.coordinates = [coordinates[1], coordinates[0]];
            return measured;
          })
          return action.measurements;
    default:
      return state;
  }
}