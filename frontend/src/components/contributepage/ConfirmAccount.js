import React, { Component } from 'react'
import Header from '../header/Header';
import Subheader from '../subheader/Subheader';
import { Link } from 'react-router-dom';
import getTranslation from '../../i18n/'
import Footer from '../footer/Footer'

/**
 * Confirm account component
 */
class ConfirmAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {confirm: false}
    }

    componentDidMount() {
        // When component is mounted do the confirmation check
        this.confirmUser();
    }

    /**
     * Actually confirm the user
     * If no confirmation code or email is given via the URL the confirm: false state stays
     * If confirmation code and email are given, the confirmAccount action is dispatched
     */
    confirmUser() {
        if((this.props.confirmationCode) && (this.props.email)) {
            this.setState({confirm: true})
            this.props.confirmAccount(this.props.confirmationCode, this.props.email);
        }
    }

    render() {

        return(
            <div>
                <Header />
                <div className="container container-small">
                    <Subheader title={"subheader.confirm_account"} />
                </div>
                <div className="container container-very-small">
                    <div className="default-element">
                        <h3>{getTranslation("confirmaccount.title")}</h3>
                        <div className="default-element-content">
                        {((this.props.fetching.dataFetching.data === 'confirm') && (this.props.fetching.dataFetching.isFetching)) &&
                            <div>
                                <div className="loader"></div>
                                <p>{getTranslation("confirmaccount.checking")}</p>
                            </div>
                        }
                        {((this.props.fetching.dataFetching.data !== 'confirm') && (!this.props.fetching.dataFetching.isFetching) && (!this.state.confirm)) &&
                            <div>
                                <p>{getTranslation("confirmaccount.thank_you")}</p>
                                <p>{getTranslation("confirmaccount.next_steps")}</p>
                            </div>
                        }
                        {((this.props.fetching.dataFetching.data === 'confirm') && (!this.props.fetching.dataFetching.isFetching) && (this.state.confirm)) &&
                            <div>
                                <div className="big-icon-container">
                                        <i className={"fa "+(!this.props.fetching.dataFetching.status ? "fa-times" : "fa-check")+" big-icon"} aria-hidden="true"></i>
                                </div>
                                <p>{getTranslation(this.props.fetching.dataFetching.message)}</p>
                            </div>
                        }
                            <Link to="/experts"><button className="btn btn-green centered">{getTranslation("confirmaccount.linkback")}</button></Link>
                        </div>
                    </div>
                </div>
                <div className="container container-small">
                <Footer pages={this.props.pages} />
                </div>
            </div>
        )
    }
}
export default ConfirmAccount;
