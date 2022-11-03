import { connect} from "react-redux";
import UserProfileView from "../components/contributepage/UserProfileView";

const mapStateToProps = (state) => {
    cookies: state.cookies.values
}

const UserProfileViewContainer = connect(mapStateToProps)(UserProfileView)
export default UserProfileViewContainer