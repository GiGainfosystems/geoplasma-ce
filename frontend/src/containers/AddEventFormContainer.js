import { connect } from 'react-redux'
import AddEventForm from '../components/contributepage/AddEventForm'
import { addEvent, removeEvent } from '../actions'

const mapStateToProps = (state, ownProps) => {
    let id;
    if(!ownProps.match.params.id) {
        id = 0;
    } else {
        id = ownProps.match.params.id
    }
  return {
    user: state.user,
    events: state.events,
    id: id,
    pages: state.pages,
    countries: state.countries,
    language: state.language,
    cookies: state.cookies.values,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addEvent: (id, name, organized_by, contact, contact_email, date1, date2, location, country, website, token) => {
      dispatch(addEvent(id, name, organized_by, contact, contact_email, date1, date2, location, country, website, token))
  },
  removeEvent: (id, token) => {
      dispatch(removeEvent(id, token))
  }
  }
}

const AddEventFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEventForm)

export default AddEventFormContainer
