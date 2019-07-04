import React, { Component } from 'react'
import './Logo.css'
import logo from './logo.png'
import { Link } from 'react-router-dom'

/**
 * Displays the GeoPLASMA-CE / Interreg logo on the right side of the header
 */
class Logo extends Component {

  render() {
    return(
      <div className="Logo">
        <Link to="/"><img src={logo} alt="Logo" /></Link>
      </div>
    )
  }

}

export default Logo
