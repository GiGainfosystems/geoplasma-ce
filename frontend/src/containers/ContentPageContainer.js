import { connect } from 'react-redux'
import ContentPage from '../components/homepage/ContentPage'
import {
  deleteCookie,
  getCookie,
  setCookie
} from "../actions";



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
    examples: state.examples,
    cookies: state.cookies.values
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCookie: (name) => {
      dispatch(deleteCookie(name))
    },
    getCookie: (name) => {
      dispatch(getCookie(name))
    },
    setCookie: (name, value) => {
      dispatch(setCookie(name, value))
    },
  }
}


const ContentPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContentPage)

export default ContentPageContainer
