import { connect } from "react-redux";
import CustomImageSideButton from "../components/admin/RteImages";

const mapStateToProps = (state) => {
  return {
    cookies: state.cookies.values,
  }
};

const CustomImageSideButtonContainer = connect(
    mapStateToProps
)(CustomImageSideButton);

export default CustomImageSideButtonContainer;