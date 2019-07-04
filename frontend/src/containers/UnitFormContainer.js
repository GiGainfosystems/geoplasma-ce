import { connect } from 'react-redux'
import UnitForm from '../components/admin/UnitForm'
import {saveUnit, removeUnit } from '../actions'

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
    units: state.units,
    superuser: state.superuser,
    fetching: state.fetching,
    language: state.language,
    pilotareas: state.pilotareas,
    id: id
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveUnit: (id, color, area, identifier, title_en, title_de, title_cz, title_pl, title_sk, title_sl, description_en, description_de, description_cz, description_pl, description_sk, description_sl, token) => {
            dispatch(saveUnit(id, color, area, identifier, title_en, title_de, title_cz, title_pl, title_sk, title_sl, description_en, description_de, description_cz, description_pl, description_sk, description_sl, token))
        },
        removeUnit: (id, token) => {
          dispatch(removeUnit(id, token))
      }
    }
}

const UnitFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitForm)

export default UnitFormContainer
