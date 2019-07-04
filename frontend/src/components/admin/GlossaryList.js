import React, { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * This component lists all glossary entries for the superuser in the admin area
 * The user can click on any entry to edit or remove it. Also, a new entry can be added
 * by clicking the according button in this component
 */
class GlossaryList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <Link to="/experts/superuser/glossary"><button className="btn btn-green">Add a keyword</button></Link>
                <table cellSpacing="0" className="superuser-table">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Keyword</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.glossary.map((entry, index) =>
                        <tr key={entry.id} className={(index % 2 === 0 ? 'even' : 'odd')}>
                            <td>{entry.id}</td>
                            <td><Link to={("/experts/superuser/glossary/"+entry.id)}>{entry.keyword}</Link></td>
                        </tr>

                    )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default GlossaryList
