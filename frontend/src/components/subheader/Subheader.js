import React, { Component } from 'react'
import './Subheader.css'
import getTranslation from '../../i18n/'
import { Link } from 'react-router-dom'

/**
 * The subheader containing the breadcrumps on the knowledge platform
 */
class Subheader extends Component {

  render() {
    return(
      <div className="subheader">
        <h2><Link to="/">Geoplasma-CE web-portal</Link> <i className="fa fa-angle-right" aria-hidden="true"></i> <Link to="/experts">{getTranslation("subheader.start")}</Link> <i className="fa fa-angle-right" aria-hidden="true"></i> {getTranslation(this.props.title)}</h2>
        <Link to="/experts/contribute"><button className="btn btn-contribute">{getTranslation("subheader.contribute_button")}</button></Link>
      </div>
    )
  }

}

export default Subheader
