import { connect } from "react-redux";
import ContactDetail from "../components/admin/ContactDetail";

const mapStateToProps = (state) => {
  return {
    cookies: state.cookies.values,
  }
};

const ContactDetailContainer = connect(
    mapStateToProps
)(ContactDetail);

export default ContactDetailContainer;