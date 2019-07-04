import React from 'react';
import Cookies from 'universal-cookie';
import getTranslation from '../../i18n/'

/** Initialize the cookies to get the token for authorization */
const cookies = new Cookies();
let token = cookies.get('token');

/**
 * Component gives the possibility to update the international projects section on the web-portal with bulk-editing
 */
class Links extends React.Component {

    constructor(props) {
        super(props)
    }
    
    /**
     * Dispatch the updateLinks action to update the international projects section
     */
    updateLinks() {
        this.props.updateLinks(token)
    }

    render() {
        return(
            <div>
                <button className="btn btn-green" onClick={() => this.updateLinks()}>Update international links section</button>
            </div>
        )
    }
}


export default Links;
