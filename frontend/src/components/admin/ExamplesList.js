import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Component displays a list with all case studies on the web portal
 * @param  {} props
 */
function ExamplesList(props) {
    return (
        <div>
            <Link to="/experts/superuser/examples"><button className="btn btn-green">Add an example</button></Link>
            <table cellSpacing="0" className="superuser-table">
                <thead>
                    <tr>
                        <td>Pilotarea</td>
                        <td>Title</td>
                    </tr>
                </thead>
                <tbody>
                {props.examples.map((example, index) =>
                    <tr key={example.id} className={(index % 2 === 0 ? 'even' : 'odd')}>
                        <td>{example.pilotarea_id}</td>
                        <td><Link to={("/experts/superuser/examples/"+example.id)}>{example.title}</Link></td>
                    </tr>

                )}
                </tbody>
            </table>
        </div>
    )
}

export default ExamplesList
