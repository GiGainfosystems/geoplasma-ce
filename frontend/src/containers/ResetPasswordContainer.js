import { connect } from 'react-redux'
import ResetPassword from '../components/contributepage/ResetPassword'
import { confirmPasswordReset, changePassword } from '../actions'


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
        confirmPasswordReset: (token, email) => {
            dispatch(confirmPasswordReset(token, email))
        },
        changePassword: (token, email, password) => {
            dispatch(changePassword(token, email, password))
        }
    }
}


const ResetPasswordContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword)

export default ResetPasswordContainer
