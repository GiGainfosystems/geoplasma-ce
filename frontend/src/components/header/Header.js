import React, { Component } from 'react'
import './Header.css'
// Import children components
import Logo from './logo/Logo'
import NavigationContainer from "../../containers/NavigationContainer";

/**
 * The header of the web portal
 */
class Header extends Component {

    constructor(props) {
        super(props);
    }
    
  render() {
    return(
        <div>
          <div className="Header">
            <div className="container">
              <NavigationContainer title={this.props.title} />
              <Logo />
            </div>
          </div>
      </div>
    )
  }

}

export default Header
