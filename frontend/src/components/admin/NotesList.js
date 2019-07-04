import React, { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * Component displays a list explanatory notes and provides a link to the form to edit each single note
 */
class NotesList extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return(

            <div>
                <Link to="/experts/superuser/notes"><button className="btn btn-green">Add a note</button></Link>
                <table cellSpacing="0" className="superuser-table">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Key</td>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.explanatorynotes.map((entry, index) =>
                        <tr key={entry.id} className={(index % 2 === 0 ? 'even' : 'odd')}>
                            <td>{entry.id}</td>
                            <td><Link to={("/experts/superuser/notes/"+entry.id)}>{entry.key}</Link></td>
                        </tr>

                    )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default NotesList
