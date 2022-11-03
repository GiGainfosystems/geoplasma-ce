import { connect } from 'react-redux'
import ContributeOverview from '../components/contributepage/ContributeOverview'
import {signOut, toggleUserprofile, removeUser, deleteCookie} from '../actions'

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
    cookies: state.cookies.values,
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => {
            dispatch(signOut())
            dispatch(deleteCookie('token'))
        },
        toggleUserprofile: (id, token) => {
            dispatch(toggleUserprofile(id,token))
        },
        removeUser: (token) => {
          dispatch(removeUser(token))
        },
        deleteCookie: (name) => {
            dispatch(deleteCookie(name))
        },
    }
}

const ContributeOverviewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContributeOverview)

export default ContributeOverviewContainer
