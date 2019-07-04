import { connect } from 'react-redux'
import ContactForm from '../components/admin/ContactForm'
import { saveLocalContact } from '../actions'

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
    localcontacts: state.localcontacts,
    superuser: state.superuser,
    fetching: state.fetching,
    language: state.language,
    pilotareas: state.pilotareas,
    id: id
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveLocalContact: (id, language, pilotarea, contactinfo, token) => {
            dispatch(saveLocalContact(id, language, pilotarea, contactinfo, token))
        }
    }
}

const ContactFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactForm)

export default ContactFormContainer
