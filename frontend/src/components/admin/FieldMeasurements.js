import React from 'react';
import Cookies from 'universal-cookie';
import getTranslation from '../../i18n/'

/** Initialize the cookies to get the token for authorization */
const cookies = new Cookies();
let token = cookies.get('token');

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
    updateFieldmeasurements(area, token) {
        this.props.updateFieldmeasurements(area, token)
    }

    render() {
        return(
            <table>
                <tbody>
                    {this.props.pilotareas.map(area =>
                        <tr>
                            <td>{getTranslation(area.name)}</td>
                            <td><button className="btn btn-green" onClick={() => this.updateFieldmeasurements(area.id, token)}>Update field measurements</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}


export default FieldMeasurements;
