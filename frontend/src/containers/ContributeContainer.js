import { connect } from 'react-redux'
import ContributePage from '../components/contributepage/ContributePage'
import { signIn, signUp, checkIfLoggedIn } from '../actions'


const mapStateToProps = (state) => {
  return {
    categories: state.language,
    user: state.user,
    fetching: state.fetching,
    content: state.content,
    pages: state.pages,
    language: state.language,
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (username, email, password) => {
            dispatch(signUp(username, email, password))
        },
        signIn: (email, password) => {
          dispatch(signIn(email, password))
        },
        checkIfLoggedIn: (token) => {
          dispatch(checkIfLoggedIn(token))
        }
    }
}

const ContributeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContributePage)

export default ContributeContainer
