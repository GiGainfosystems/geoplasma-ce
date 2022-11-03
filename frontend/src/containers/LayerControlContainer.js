import { connect } from "react-redux";
import LayerControl from "../components/admin/LayerControl";

const mapStateToProps = (state) => {
  return {
    cookies: state.cookies.values,
  }
};

const LayerControlContainer = connect(
    mapStateToProps
)(LayerControl);

export default LayerControlContainer;