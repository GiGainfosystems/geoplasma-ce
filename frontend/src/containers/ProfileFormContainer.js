import { connect } from 'react-redux'
import ProfilePage from '../components/contributepage/ProfilePage'
import { geocodeAddress, updateUserprofile } from '../actions'

const mapStateToProps = (state) => {
  return {
    language: state.language,
    user: state.user,
    events: state.events,
    userprofile: state.userprofiles.profiles,
    fetching: state.fetching,
    pilotareas: state.pilotareas,
    professionalgroups: state.professionalgroups,
    countries: state.countries,
    pages: state.pages
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    geocodeAddress: (street, zip, city) => {
      dispatch(geocodeAddress(street, zip, city))
    },
  updateUserprofile: (name, occupation, street, zip, city, country, phone, email, website, pilotArea, lat, lon, contactForm, activated, profile, token) => {
    dispatch(updateUserprofile(name, occupation, street, zip, city, country, phone, email, website, pilotArea, lat, lon, contactForm, activated, profile, token))
    }
  }
}

const ProfileFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePage)

export default ProfileFormContainer
