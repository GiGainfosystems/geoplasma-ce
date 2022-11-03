import React from 'react';
import getTranslation from '../../i18n/'

/**
 * List the field measurements for all pilot areas and gives the possibility to update them in bulk
 */
class FieldMeasurements extends React.Component {

    constructor(props) {
        super(props)
    }

    /**
     * Update the field measurements by dispatching the according action
     * @param  {} area - The pilot area which field measurements should be updated
     * @param  {} token - JWT token
     */
    updateFieldmeasurements(area) {
        const token = this.props.cookies.token;
        this.props.updateFieldmeasurements(area, token)
    }

    render() {
        return(
            <table>
                <tbody>
                    {this.props.pilotareas.map(area =>
                        <tr>
                            <td>{getTranslation(area.name)}</td>
                            <td><button className="btn btn-green" onClick={() => this.updateFieldmeasurements(area.id)}>Update field measurements</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}


export default FieldMeasurements;
