import { connect } from 'react-redux'
import AddContent from '../components/contributepage/AddContent'
import { addContent, removeContent } from '../actions'

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    categories: state.categories.knowledgerepository,
    languages: state.language.availableLanguages,
    topics: state.topics,
    contents: state.content,
    id: ownProps.match.params.id,
    tags: state.tags,
    pages: state.pages,
    language: state.language,
    cookies: state.cookies.values,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addContent: (id, title, year, author, publisher_place, territorial_coverage, language, synposis, link, topics, tags, internal_id, external_link, token) => {
      dispatch(addContent(id, title, year, author, publisher_place, territorial_coverage, language, synposis, link, topics, tags, internal_id, external_link, token))
    },
    removeContent: (id, token) => {
        dispatch(removeContent(id,token))
    }
  }
}

const EditContentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddContent)

export default EditContentContainer
