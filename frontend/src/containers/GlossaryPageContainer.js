import { connect } from 'react-redux'
import GlossaryPage from '../components/glossary/GlossaryPage'


const mapStateToProps = (state) => {
  return {
    categories: state.categories,
    language: state.language,
    pages: state.pages,
    sitecontent: state.sitecontent,
    glossary: state.glossary.entries,
    basic: state.glossary.basic,
    fetching: state.fetching,
    pilotareas: state.pilotareas,
    localcontacts: state.localcontacts
  }
}


const GlossaryPageContainer = connect(
  mapStateToProps
)(GlossaryPage)

export default GlossaryPageContainer
