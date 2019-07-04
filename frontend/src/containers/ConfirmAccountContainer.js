import { connect } from 'react-redux'
import ConfirmAccount from '../components/contributepage/ConfirmAccount'
import { confirmAccount } from '../actions'


const mapStateToProps = (state, ownProps) => {
  return {
    categories: state.language,
    user: state.user,
    confirmationCode: ownProps.match.params.confirmationCode,
    email: ownProps.match.params.email,
    fetching: state.fetching,
    pages: state.pages,
    language: state.language,
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        confirmAccount: (confirmation_code, email) => {
            dispatch(confirmAccount(confirmation_code, email))
        }
    }
}

const ConfirmAccountContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmAccount)

export default ConfirmAccountContainer
