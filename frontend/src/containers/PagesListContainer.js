import { connect } from "react-redux";
import PagesList from "../components/admin/PagesList";

const mapStateToProps = (state) => {
  return {
    cookies: state.cookies.values,
  }
};

const PagesListContainer = connect(
    mapStateToProps
)(PagesList);

export default PagesListContainer;