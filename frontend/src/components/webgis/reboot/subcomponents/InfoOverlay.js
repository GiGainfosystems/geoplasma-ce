import React from 'react';
import getTranslation from '../../../../i18n/'

/**
 * The overlay that appears on startup of the GIS with an infotext on how to create a report
 * @param {*} props 
 */
function InfoOverlay(props) {
    return(
        <div className="info-overlay">
            <div className="info-text">
                <p>{getTranslation("webgis.explain")}</p>
            </div>
            <button onClick={props.closeOverlay} className="btn btn-blue"><i className="fas fa-times"></i></button>
        </div>
    )
}

export default InfoOverlay
