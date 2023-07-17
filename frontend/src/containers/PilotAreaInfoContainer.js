import { connect} from "react-redux";
import { setCookie } from "../actions";
import PilotAreaInfo from "../components/webgis/reboot/subcomponents/PilotAreaInfo";


const mapDispatchToProps = (dispatch) => {
    return {
        setCookie: (name, value) => {
            dispatch(setCookie(name, value))
        },
    }
}

const PilotAreaInfoContainer = connect(
    null,
    mapDispatchToProps)(PilotAreaInfo)

export default PilotAreaInfoContainer;