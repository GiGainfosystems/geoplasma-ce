import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie';
const cookies = new Cookies();

/**
 * List the pages on the web portal and the contents on them
 */
class PagesList extends Component {

    constructor(props) {
        super(props);

    }

    /**
     * Remove a page from the web portal by dispatching the removePage action
     * @param  {} id - ID of the page that should be deleted
     */
    removePage(id) {
        let token = cookies.get('token');
        this.props.removePage(id, token)
    }

    render() {

        let pages = this.props.pages;
        pages.map(page => {
            page.content = this.props.sitecontent.filter(content => content.page_id === page.id);
        })

        return(

            <div>
                <Link to="/experts/superuser/page"><button className="btn btn-green">Add a page</button></Link>
                {pages.map((page, index) =>
                    <table key={page.id} cellSpacing="0" className="superuser-table">
                        <thead>
                            <tr>
                                <td><Link to={"/experts/superuser/page/"+page.id}>{page.title}</Link></td>
                                <td><span onClick={() => this.removePage(page.id)}>Remove</span></td>
                                <td><Link to={("/experts/superuser/pagecontent/"+page.id)}>Add content</Link></td>
                            </tr>
                        </thead>
                        <tbody>
                        {page.content.map((content, index) =>
                            <tr key={content.id} className={(index % 2 === 0 ? 'even' : 'odd')}>
                                <td>{content.id}</td>
                                <td colSpan="2"><Link to={("/experts/superuser/pagecontent/"+page.id+"/"+content.id)}>{content.title}</Link></td>
                            </tr>

                        )}
                        </tbody>
                    </table>
                )}

            </div>
        )
    }
}

export default PagesList
