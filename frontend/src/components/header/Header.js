import React, { Component } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
// Import children components
import Logo from './logo/Logo'
import Cookies from 'universal-cookie';
import Navigation from './navigation/Navigation'

const cookies = new Cookies();

/**
 * The header of the web portal
 */
class Header extends Component {

    constructor(props) {
        super(props);
        let cookiesAccepted = false;
        if(cookies.get('cookies_accepted')) {
            cookiesAccepted = true;
        }
        this.state = { cookiesAccepted: cookiesAccepted}
    }

    /**
     * If a user accepts cookies, save this setting as a cookie..
     */
    acceptCookies() {
        cookies.set('cookies_accepted', true, { path: '/'});
        this.setState({ cookiesAccepted: true})
    }

  render() {
    return(
        <div>
            {!this.state.cookiesAccepted &&
            <div className="cookie-warning">
            <p>
            This website uses cookies. By using this website you accept our cookie policy that you can <Link to="/content/disclaimer">read here</Link>. <button className="btn btn-green" onClick={() => this.acceptCookies()}>I accept the cookie policy</button>
            </p>
            </div>
            }
          <div className="Header">
            <div className="container">
              <Navigation title={this.props.title} />
              <Logo />
            </div>
          </div>
      </div>
    )
  }

}

export default Header
