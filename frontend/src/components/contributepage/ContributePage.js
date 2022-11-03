import React, { Component } from 'react'
import './ContributePage.css'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import { Redirect } from 'react-router-dom'
import Footer from '../footer/Footer'

/**
 * The component that controls if a user sees the dashboard etc.
 */
class ContributePage extends Component {

    componentDidMount() {

        const token = this.props.cookies.token;
        if(token) {
            this.props.checkIfLoggedIn(token);
        }
    }

  render() {


      if((this.props.user.isLoggedIn) && (this.props.user.confirmed) && (this.props.user.superuser)) {
          return <Redirect to='/experts/superuser'/>;
      }

    if((this.props.user.isLoggedIn) && (this.props.user.confirmed)) {
        return <Redirect to='/experts/contribute/overview'/>;
    }

    if((this.props.user.isSignedUp) && (!this.props.user.confirmed)) {
        return <Redirect to='/experts/confirm-account'/>;
    }

    if((this.props.user.isLoggedIn) && (!this.props.user.confirmed)) {
        return <Redirect to='/experts/confirm-account'/>;
    }

    return(


      <div className="contribute-page">

        <Header />
        <div className="container container-small">
          <Subheader title={"subheader.contribute"} />
          <div className="container-flex">
            <SignInForm signIn={this.props.signIn} fetching={this.props.fetching} />
            <SignUpForm signUp={this.props.signUp} fetching={this.props.fetching} />
          </div>
          <Footer pages={this.props.pages} />
        </div>
      </div>
    )
  }
}

export default ContributePage
