import { connect } from 'react-redux'
import ContentPage from '../components/homepage/ContentPage'



const mapStateToProps = (state, ownProps) => {
  return {
    categories: state.categories,
    language: state.language,
    pages: state.pages,
    sitecontent: state.sitecontent,
    glossary: state.glossary.entries,
    url: ownProps.match.params.url,
    pilotareas: state.pilotareas,
    localcontacts: state.localcontacts,
    links: state.links,
    examples: state.examples
  }
}


const ContentPageContainer = connect(
  mapStateToProps,
)(ContentPage)

export default ContentPageContainer
