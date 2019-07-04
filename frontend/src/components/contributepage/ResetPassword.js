import React, { Component } from 'react'
import Header from '../header/Header';
import Subheader from '../subheader/Subheader';
import { Link, Redirect } from 'react-router-dom';
import getTranslation from '../../i18n/'
import Footer from '../footer/Footer'

/**
 * Reset password form
 */
class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            password: '',
            confirmPassword: '',
            errorMessages: [],
            errors: {
            password: false,
            confirmPassword: false,
            },
            confirm: false,
            fetching: true,
            passwordFormSuccess: false
        }
    }
 
    /**
     * Update the fields, function gets called if any of the form fields gets changed
     * Does validation depending on the field that was changed and displays validation errors
     * @param  {} event
     */
    updateField(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({ [name] : value })

        let errors = this.state.errors;

        // If the field is empty set the error state for this field to true
        if(event.target.value === '') {
            errors[name] = true;
        } else {
            errors[name] = false;
        }

        // Checks if the password and the confirmPassword field have the same value
        if(name === 'confirmPassword') {
            if(this.state.password !== event.target.value) {
                errors[name] = true;
            } else {
                errors[name] = false;
            }
        }
    }

    // If token and email attributes are received via the URL send the request to confirm
    // the password forgotten request
    componentDidMount() {
        if((!this.props.token) || (!this.props.email)) {
            this.setState({ redirect: true})
        } else {
            this.confirmPasswordReset(this.props.token, this.props.email);
        }
    }

    /**
     * Validate the form and if no error is found dispatch the changePassword action
     * @param  {} event
     */
    changePassword(event) {
        event.preventDefault();
        let errorMessages = [];

        // If any of the fields is empty push the according error message
        if((this.state.password === '') ||(this.state.confirmPassword === '')) {
            errorMessages.push('forms.general.error.message.fields_required');
        }

        // Checks if the password and the confirmPassword field have the same value
        if(this.state.password !== this.state.confirmPassword) {
            errorMessages.push('forms.signup.error.message.passwords_match');
        }

        // If there is no error dispatch the changePassword action
        if(errorMessages.length === 0) {
            this.props.changePassword(this.props.token, this.props.email, this.state.password);
        }

        // Set new error messages in the state.
        this.setState({ fetching: true, errorMessages: errorMessages});
    }

    componentWillReceiveProps(nextProps) {
        
       let fetching = this.state.fetching
       let passwordFormSuccess = this.state.passwordFormSuccess
        let errorMessages = this.state.errorMessages;
        if(nextProps.fetching.dataFetching.data === 'confirmpasswordreset') {
            if(nextProps.fetching.dataFetching.isFetching) {
                fetching = true;
            } else if (!nextProps.fetching.dataFetching.status) {
                fetching = false;
                let index_of = errorMessages.indexOf(nextProps.fetching.dataFetching.message);
                if(index_of === -1) {
                    errorMessages.push(nextProps.fetching.dataFetching.message)
                }
                this.setState({fetching, errorMessages })
            } else if(nextProps.fetching.dataFetching.status) {
                fetching = false;
                this.setState({fetching, errorMessages })
            }
        }
        if(nextProps.fetching.formRequest.form === 'changepassword') {
            if(nextProps.fetching.formRequest.isFetching) {
                fetching = true;
            } else if (!nextProps.fetching.formRequest.status) {
                fetching = false;
                let index_of = errorMessages.indexOf(nextProps.fetching.formRequest.message);
                if(index_of === -1) {
                    errorMessages.push(nextProps.fetching.formRequest.message)
                }
                this.setState({fetching, errorMessages })
            } else if(nextProps.fetching.formRequest.status) {
                fetching = false;
                passwordFormSuccess = true;
                this.setState({fetching, passwordFormSuccess, errorMessages })
            }
        }
    }

    /**
     * Verify the token and email and check if a password forgotten request was generated for these credentials
     * dispatch the confirmPasswordReset action
     * @param  {} token
     * @param  {} email
     */
    confirmPasswordReset(token, email) {
        this.props.confirmPasswordReset(token, email);
    }

    render() {
        return(
            <div>
                <Header />
                <div className="container container-small">
                    <Subheader title={"subheader.reset_password"} />
                </div>
                <div className="container container-very-small">
                    <div className="default-element default-element-dark">
                        <h3>{getTranslation("forgotpassword.title")}</h3>
                        <div className="default-element-content">

                        {(this.state.fetching) &&
                            <div>
                                <div className="loader"></div>
                            </div>
                        }


                        {((!this.state.fetching) && (this.state.errorMessages.length > 0) && (!this.state.passwordFormSuccess)) &&
                            <div>
                                <div className="big-icon-container">
                                        <i className="fa fa-times big-icon" aria-hidden="true"></i>
                                </div>
                                <p>{getTranslation(this.props.fetching.dataFetching.message)}</p>
                                <Link to="/experts/contribute"><button className="btn btn-green centered">{getTranslation("forgotpassword.back_to_signin")}</button></Link>
                            </div>
                        }

                        {((!this.state.fetching) && (this.state.errorMessages.length === 0) && (!this.state.passwordFormSuccess)) &&
                            <div>
                            <p>{getTranslation("forgotpassword.change_password")}</p>
                            {this.state.errorMessages.length > 0 &&
                                <div className="error-messages">
                                    {this.state.errorMessages.map((error, index) =>
                                        <p key={index}>{getTranslation(error)}</p>
                                    )}
                                </div>
                            }
                            <form onSubmit={(e) => this.changePassword(e)} method="post">
                              <label className="centered">{getTranslation('forms.general.password.label')}:{this.state.errors.password && <span className="validation-error">{getTranslation('forms.general.error.hints.field_required')}</span>}</label>
                              <input className={(this.state.errors.password ? 'v-error' : 'v-check')} name="password" value={this.state.password} type="password" placeholder={getTranslation('forms.general.password.placeholder')} onChange={(event) => this.updateField(event)} />
                              <label className="centered">{getTranslation('forms.signup.password_repeat.label')}:{this.state.errors.confirmPassword && <span className="validation-error">{getTranslation('forms.signup.error.hint.passwords_match')}</span>}</label>
                              <input className={(this.state.errors.confirmPassword ? 'v-error' : 'v-check')} name="confirmPassword" value={this.state.confirmPassword} type="password" placeholder={getTranslation('forms.signup.password_repeat.placeholder')} onChange={(event) => this.updateField(event)} />
                              <button type="submit" className="btn-icon btn-green btn-signup">{getTranslation('forgotpassword.reset_button')}</button>
                            </form>
                            </div>
                        }

                        {((!this.state.fetching) && (this.props.fetching.formRequest.form === 'changepassword')) &&
                            <div>
                                <div className="big-icon-container">
                                        <i className={"fa "+(!this.props.fetching.formRequest.status ? "fa-times" : "fa-check")+" big-icon"} aria-hidden="true"></i>
                                </div>
                                <p>{getTranslation(this.props.fetching.formRequest.message)}</p>
                                <Link to="/experts/contribute"><button className="btn btn-green centered">{getTranslation("forgotpassword.back_to_signin")}</button></Link>
                            </div>
                        }

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
export default ResetPassword;
