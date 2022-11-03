import { connect } from "react-redux";
import EventDetail from "../components/admin/EventDetail";

const mapStateToProps = (state) => {
  return {
    cookies: state.cookies.values,
  }
};

const EventDetailContainer = connect(
    mapStateToProps
)(EventDetail);

export default EventDetailContainer;