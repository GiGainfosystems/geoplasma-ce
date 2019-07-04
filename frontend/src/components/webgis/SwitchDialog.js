import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import getTranslation from '../../i18n/'

/**
 * Dialog to switch to another pilot area
 */
class SwitchDialog extends Component {

  render() {

    return(
      <div className="gis-overlay-dialog">
        <h2>{getTranslation("switch_pilotarea.label")} <button className="btn btn-blue" onClick={() => this.props.switchDialog()}><i class="fas fa-times"></i></button></h2>
        <div className="gis-overlay-dialog-content">
          <ul>
          {this.props.pilotareas.map(area =>
            <a key={area.id} href={"/webgis/"+area.uri}><li>{getTranslation(area.name)}</li></a>
          )}
          </ul>
        </div>
      </div>
    )
  }
}

export default SwitchDialog
