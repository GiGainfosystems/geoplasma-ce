import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './BigTile.css'
import getTranslation from '../../i18n/'

/**
 * Tile for the teaser to the knowledge platform in the sidebar of the landing page
 */
class BigTileBlue extends Component {

  render() {
    return(
        <Link to={this.props.link}>
      <div className="bigtileblue">
        <h3>{getTranslation(this.props.title)} </h3>
        <div className="icon">
          <i className={'fa fa-'+this.props.icon} aria-hidden="true"></i>
        </div>
        <div className="categorie-description">
          <p>{getTranslation(this.props.description)}</p>
          <button className="btn btn-blue">{getTranslation(this.props.linktitle)}</button>
        </div>
      </div>
      </Link>
    )
  }
}

export default BigTileBlue
