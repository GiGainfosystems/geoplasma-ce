import React from 'react'
import getTranslation from '../../../../i18n/'

/**
 * Legend for the traffic light map values in the report
 */
class ReportLegend extends React.Component {
    render() {
        return(
            <div className="report-legend">
                {this.props.report.traffic_light_maps.length > 0 &&
                <ul>
                    {this.props.report.traffic_light_maps[0].legend.map((entry, index) =>
                        <li key={index}><span style={{backgroundColor : entry.color}}></span>{getTranslation(entry.label)}</li>
                    )}
                </ul>
                }
            </div>
        )
    }
}

export default ReportLegend;