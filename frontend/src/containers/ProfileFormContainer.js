import { connect } from "react-redux";
import ProfileForm from "../components/contributepage/ProfileForm";

const mapStateToProps = (state) => {
  return {
    cookies: state.cookies.values,
  }
};

const ProfileFormContainer = connect(
    mapStateToProps
)(ProfileForm);

export default ProfileFormContainer;