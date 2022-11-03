import { connect } from "react-redux";
import ContentDetail from "../components/admin/ContentDetail";

const mapStateToProps = (state) => {
  return {
    cookies: state.cookies.values,
  }
};

const ContentDetailContainer = connect(
    mapStateToProps
)(ContentDetail);

export default ContentDetailContainer;