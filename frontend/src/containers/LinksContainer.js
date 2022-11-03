import { connect } from "react-redux";
import Links from "../components/admin/Links";

const mapStateToProps = (state) => {
  return {
    cookies: state.cookies.values,
  }
};

const LinksContainer = connect(
    mapStateToProps
)(Links);

export default LinksContainer;