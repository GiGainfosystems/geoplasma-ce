import React from 'react';

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
        const token = this.props.cookies.token;
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
