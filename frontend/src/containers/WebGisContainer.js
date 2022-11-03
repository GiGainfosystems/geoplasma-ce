import { connect } from 'react-redux'
import WebGis from '../components/webgis/reboot/WebGis'
import {
  virtualBorehole,
  getMeasurements,
  generatePDF,
  geocodeAddress,
  reportQuery,
  getLayers,
  locationQuery,
  updateMapProps,
} from '../actions'


const mapStateToProps = (state, ownProps) => {
  let localExperts = [];
  let expertGroups = [];
  if((state.userprofiles.profiles.length > 0) && (state.pilotareas.length > 0)) {
    localExperts = state.userprofiles.profiles.filter(profile => profile.activated === true);
    let area = state.pilotareas.filter(area => area.uri === ownProps.match.params.area)[0].id;
    localExperts = localExperts.filter(expert => Number(expert.pilot_area) === area);
    let professions = [];
    localExperts.map(expert => {
      expert.professions = [];
      expert.occupation.map(profession => {
        if(profession !== 0) {
          expert.professions.push(state.professionalgroups.filter(group => group.id === profession)[0].name)
        }
        if((professions.indexOf(profession) === -1) && (profession !== 0)) {
          professions.push(profession);
        }
      })

    })

    professions.map(group => {

      let groupObject = {
        id: group,
        label: state.professionalgroups.filter(pgroup => pgroup.id === group)[0].name,
        count: localExperts.filter(expert => expert.occupation.indexOf(group) !== -1).length
      }
      expertGroups.push(groupObject)
    })
  }

  let activeArea = {};
  let bounds = state.webgis.bounds ? state.webgis.bounds : [[parseFloat(52.039139), parseFloat(20.996834)], [parseFloat(44.498037), parseFloat(12.489057)]];
  if(state.pilotareas.length > 0) {
    activeArea = state.pilotareas.filter(area => area.uri === ownProps.match.params.area)[0];
    if(ownProps.match.params.area === activeArea.uri) {
      bounds = [activeArea.neCorner, activeArea.swCorner];
    }
  }

  return {
    activeArea: activeArea,
    categories: state.categories,
    language: state.language,
    pages: state.pages,
    fetching: state.fetching,
    layers: state.webgis.layers,
    area: ownProps.match.params.area,
    pilotareas: state.pilotareas,
    userprofiles: state.userprofiles,
    localExperts: localExperts,
    expertGroups: expertGroups,
    bounds: bounds,
    boundsarea: state.webgis.area,
    activeLayer: state.webgis.activeLayer,
    query: state.query,
    report: state.report,
    measurements: state.measurements,
    explanatorynotes: state.explanatorynotes,
    units: state.units,
    cookies: state.cookies.values,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    geocodeAddress: (street, zip, city) => {
      dispatch(geocodeAddress(street, zip, city))
    },
    getMeasurements: (area) => {
      dispatch(getMeasurements(area))
    },
    getLayers: (workspace, filter) => {
      dispatch(getLayers(workspace, filter))
    },
    locationQuery: (link, reportParams, layers, coords) => {
      dispatch(locationQuery(link, reportParams, layers, coords))
    },
    reportQuery: (link, layers, coords) => {
      dispatch(reportQuery(link, layers, coords))
    },
    updateMapProps: (bounds, area, selected_layer) => {
      dispatch(updateMapProps(bounds, area, selected_layer))
    },
    generatePDF: (headline, html, image, notes, exNotesHeadline) => {
      dispatch(generatePDF(headline, html, image, notes, exNotesHeadline))
    },
    virtualBorehole: (area, coordinates, srs) => {
      dispatch(virtualBorehole(area, coordinates, srs))
    },
  }
}


const WebGisContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WebGis)

export default WebGisContainer
