import { connect } from 'react-redux'
import ForgotPassword from '../components/contributepage/ForgotPassword'
import { forgotPassword } from '../actions'


const mapStateToProps = (state, ownProps) => {
  return {
    categories: state.language,
    user: state.user,
    token: ownProps.match.params.token,
    email: ownProps.match.params.email,
    fetching: state.fetching,
    pages: state.pages,
    language: state.language,
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        forgotPassword: (email) => {
            dispatch(forgotPassword(email))
        }
    }
}


const ForgotPasswordContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPassword)

export default ForgotPasswordContainer
