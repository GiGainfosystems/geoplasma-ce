import { connect } from 'react-redux'
import GlossaryForm from '../components/admin/GlossaryForm'
import { addGlossary, removeGlossary } from '../actions'

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
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addGlossary: (id, keyword, keyword_de, keyword_pl, keyword_cz, keyword_sk, keyword_sl, synonyms, synonyms_de, synonyms_pl, synonyms_cz, synonyms_sk, synonyms_sl, link, definition, definition_de, definition_cz, definition_pl, definition_sl, definition_sk, basic, token) => {
            dispatch(addGlossary(id, keyword, keyword_de, keyword_pl, keyword_cz, keyword_sk, keyword_sl, synonyms, synonyms_de, synonyms_pl, synonyms_cz, synonyms_sk, synonyms_sl, link, definition, definition_de, definition_cz, definition_pl, definition_sl, definition_sk, basic, token))
        },
        removeGlossary: (id, token) => {
            dispatch(removeGlossary(id, token))
        },
    }
}

const GlossaryFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GlossaryForm)

export default GlossaryFormContainer
