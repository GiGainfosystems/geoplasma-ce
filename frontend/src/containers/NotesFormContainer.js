import { connect } from 'react-redux'
import NotesForm from '../components/admin/NotesForm'
import { saveNote } from '../actions'

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
    events: state.events,
    superuser: state.superuser,
    fetching: state.fetching,
    glossary: state.glossary.entries,
    id: id,
    pages: state.pages,
    language: state.language,
    explanatorynotes: state.explanatorynotes.notes
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
      saveNote: (id, key, explanatory_note, explanatory_note_de, explanatory_note_cz, explanatory_note_pl, explanatory_note_sk, explanatory_note_sl, layer_description, layer_description_de, layer_description_cz, layer_description_pl, layer_description_sk, layer_description_sl, token) => {
          dispatch(saveNote(id, key, explanatory_note, explanatory_note_de, explanatory_note_cz, explanatory_note_pl, explanatory_note_sk, explanatory_note_sl, layer_description, layer_description_de, layer_description_cz, layer_description_pl, layer_description_sk, layer_description_sl, token))
      }
    }
}

const NotesFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotesForm)

export default NotesFormContainer
