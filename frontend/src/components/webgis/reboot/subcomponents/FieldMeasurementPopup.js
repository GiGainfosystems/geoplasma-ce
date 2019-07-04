import React from 'react';
import config from '../../../../config'
import getTranslation from '../../../../i18n/'

/**
 * The popup window for field measurement data
 * @param {*} props 
 */
function FieldMeasurementPopup(props) {

    const location = Object.keys(props.data).filter(key => key !== 'measurements' && key !== 'coordinates');
    const downloadurl = config.downloadUrl
    
    return (
        <div className="field-measurement">
            <h2>{getTranslation("webgis.field_measurements.location")}</h2>
            <table cellSpacing="0">
                <tbody>
                {location.map((key) =>
                    <tr key={key}>
                        <td>{getTranslation("webgis.field_measurements_"+key)}</td>
                        <td>{props.data[key]}</td>
                    </tr>
                )}
                </tbody>
            </table>
            <h2>{getTranslation("webgis.field_measurements.measurements")}</h2>
            {props.data.measurements.map((measured, index) =>
                <React.Fragment key={index}>
                    <table cellSpacing="0">
                        <tbody>
                        {Object.keys(measured).map((key, index) =>
                            <React.Fragment key={'a-'+key+index}>
                            {measured[key] &&
                            <tr key={key+index}>
                                <td>{getTranslation("webgis.field_measurements_"+key)}</td>
                                <td>{key === 'm_link_to_document' ? measured[key] !== '' ? <a href={downloadurl+measured[key]}>Download</a> : '-' : measured[key]}</td>
                            </tr>
                            }
                            </React.Fragment>
                        )}
                        </tbody>
                    </table>
                    <div className="field-measurements-between"></div>
                </React.Fragment>
            )}  
        </div>     
    )
}

export default FieldMeasurementPopup
