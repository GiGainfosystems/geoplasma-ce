import { connect } from 'react-redux'
import App from '../App'



const mapStateToProps = (state) => {
  return {
    categories: state.categories,
    language: state.language,
    pages: state.pages
  }
}


const AppContainer = connect(
  mapStateToProps,
)(App)

export default AppContainer
