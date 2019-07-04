import React from 'react'
import getTranslation from '../../../../i18n/'

/**
 * Feasibility of open / closed loop in the report pane
 */
class InfoText extends React.Component {
    render() {
        return(
            <div className="info-table">
                {this.props.maps.length > 0 &&
                    <table>
                        <tbody>
                        {this.props.maps.map(layer =>
                            <tr key={layer.id}>
                                <td className="reports-box-content text-left">
                                    <p>
                                    {layer.is_open_loop_tlm &&
                                    <React.Fragment>
                                        <strong>{getTranslation("traffic_light_map_open_loop_system.label")}</strong><br />
                                    </React.Fragment>
                                    }
                                    {layer.is_closed_loop_tlm &&
                                    <React.Fragment>
                                        <strong>{getTranslation("traffic_light_map_closed_loop_system.label")}</strong><br />
                                    </React.Fragment>
                                    }
                                    </p>
                                    <p>{getTranslation(layer.label)}</p>
                                </td>
                                <td className="reports-box-content text-right">
                                    <span style={{backgroundColor : layer.color}}></span>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}

export default InfoText;
