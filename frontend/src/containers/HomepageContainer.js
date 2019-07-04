import { connect } from 'react-redux'
import HomePage from '../components/homepage/HomePage'



const mapStateToProps = (state) => {
  return {
    categories: state.categories,
    language: state.language,
    pages: state.pages,
    sitecontent: state.sitecontent,
    glossary: state.glossary.entries,
    fetching: state.fetching,
    pilotareas: state.pilotareas,
    localcontacts: state.localcontacts
  }
}


const HomepageContainer = connect(
  mapStateToProps,
)(HomePage)

export default HomepageContainer
