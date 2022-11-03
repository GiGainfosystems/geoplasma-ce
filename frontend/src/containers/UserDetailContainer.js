import { connect } from "react-redux";
import UserDetail from "../components/admin/UserDetail";

const mapStateToProps = (state) => {
  return {
    cookies: state.cookies.values,
  }
};

const UserDetailContainer = connect(
    mapStateToProps
)(UserDetail);

export default UserDetailContainer;