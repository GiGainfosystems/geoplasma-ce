import { connect } from 'react-redux'
import MyData from '../components/contributepage/MyData'
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
        }
    }
}

const MyDataContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyData)

export default MyDataContainer
