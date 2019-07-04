import { connect } from 'react-redux'
import ExamplesForm from '../components/admin/ExamplesForm'
import {saveExample } from '../actions'

const mapStateToProps = (state, ownProps) => {
    let id;
    if(!ownProps.match.params.id) {
        id = 0;
    } else {
        id = ownProps.match.params.id
    }
  return {
    categories: state.language,
    user: state.user,
    examples: state.examples,
    superuser: state.superuser,
    fetching: state.fetching,
    language: state.language,
    pilotareas: state.pilotareas,
    id: id
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveExample: (id, pilotarea_id, title, address_of_project, gps_coordinates, usage_form, heating_capacity, heating_production, cooling_capacity, cooling_production, seasonal_performance, number_of_tubes_wells, depth_of_tubes_wells, geothermal_coverage_rate, supply_temperature_borehole, supply_temperature_heating, supply_temperature_cooling, planning_company, specialties_of_project, drilling_company, heating_installer, thermal_response_test, year_of_installation, web_link, description, introduction,token) => {
            dispatch(saveExample(id, pilotarea_id, title, address_of_project, gps_coordinates, usage_form, heating_capacity, heating_production, cooling_capacity, cooling_production, seasonal_performance, number_of_tubes_wells, depth_of_tubes_wells, geothermal_coverage_rate, supply_temperature_borehole, supply_temperature_heating, supply_temperature_cooling, planning_company, specialties_of_project, drilling_company, heating_installer, thermal_response_test, year_of_installation, web_link, description, introduction,token))
        },
    }
}

const ExamplesFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExamplesForm)

export default ExamplesFormContainer
