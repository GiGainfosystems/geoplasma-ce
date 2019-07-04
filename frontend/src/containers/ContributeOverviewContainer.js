import { connect } from 'react-redux'
import ContributeOverview from '../components/contributepage/ContributeOverview'
import { signOut, toggleUserprofile, removeUser } from '../actions'

const mapStateToProps = (state) => {

  return {
    categories: state.language,
    user: state.user,
    events: state.events,
    content: state.content,
    userprofiles: state.userprofiles.profiles,
    professionalgroups: state.professionalgroups,
    pilotareas: state.pilotareas,
    countries: state.countries,
    pages: state.pages,
    language: state.language,
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => {
            dispatch(signOut())
        },
        toggleUserprofile: (id, token) => {
            dispatch(toggleUserprofile(id,token))
        },
        removeUser: (token) => {
          dispatch(removeUser(token))
        }
    }
}

const ContributeOverviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContributeOverview)

export default ContributeOverviewContainer
