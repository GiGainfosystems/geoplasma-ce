import { connect } from "react-redux";
import FieldMeasurements from "../components/admin/FieldMeasurements";

const mapStateToProps = (state) => {
  return {
    cookies: state.cookies.values,
  }
};

const FieldMeasurementsContainer = connect(
    mapStateToProps
)(FieldMeasurements);

export default FieldMeasurementsContainer;