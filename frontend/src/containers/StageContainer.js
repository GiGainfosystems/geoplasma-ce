import { connect } from "react-redux";
import Stage from "../components/homepage/Stage";

const mapStateToProps = (state, ownProps) => {
    return {
        cookies: state.cookies.values,
    }
}
const StageContainer = connect(mapStateToProps)(Stage)
export default StageContainer