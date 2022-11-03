import { connect } from 'react-redux'
import Navigation from "../components/header/navigation/Navigation";

const mapStateToProps = (state, ownProps) => {
    return {
        cookies: state.cookies.values
    }
}
const NavigationContainer = connect(mapStateToProps)(Navigation)
export default NavigationContainer