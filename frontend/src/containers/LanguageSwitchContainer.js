import { connect } from 'react-redux'
import LanguageSwitch from '../components/header/navigation/languageswitch/LanguageSwitch'
import { changeLanguage } from '../actions'


const mapStateToProps = (state) => {
  return {
    language: state.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguage: (language) => {
      dispatch(changeLanguage(language))
    }
  }
}

const LanguageSwitchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSwitch)

export default LanguageSwitchContainer
