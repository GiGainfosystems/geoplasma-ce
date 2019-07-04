import React from 'react'
import { Link } from 'react-router-dom'

/**
 * List of units that exist in the web-portal (context: virtual boreholes)
 * @param  {} props
 */
function UnitList(props) {
    return (
        <div>
            <Link to="/experts/superuser/unit"><button className="btn btn-green">Add a unit</button></Link>
            <table cellSpacing="0" className="superuser-table">
                <thead>
                    <tr>
                        <td>Pilotarea</td>
                        <td>Unit</td>
                    </tr>
                </thead>
                <tbody>
                {props.units.map((unit, index) =>
                    <tr key={unit.id} className={(index % 2 === 0 ? 'even' : 'odd')}>
                        <td>{unit.pilotarea_id}</td>
                        <td><Link to={("/experts/superuser/unit/"+unit.id)}>{unit.identifier}</Link></td>
                    </tr>

                )}
                </tbody>
            </table>
        </div>
    )
}

export default UnitList
