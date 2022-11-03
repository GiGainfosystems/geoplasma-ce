import React, { Component } from 'react'

/**
 * This component gives the superuser the possibility to remove
 * content from the website (landingpage)
 */
class ContentDetail extends Component {
    constructor(props) {
        super(props);
        /* Get the content from the props and save it in the local state */
        let new_object = Object.assign({}, props.content)
        this.state = {
          // Content that can be removed in this component
          content: new_object
        }
    }

    /**
    * Hides the remove button for this content
    * calls the unClickContent function of the parent via props
    */
    closeDetails() {
        this.props.unClickContent();
    }

    /**
    * The content that is selected gets removed in the backend
    * via the removeContentSuperuser action (Superuser -> ContentList -> ContentDetail)
    */
    removeContent() {
        /* Get the token from the cookie for superuser authorization */
        const token = this.props.cookies.token;
        /* Call the removeContentSuperuser action via props */
        this.props.removeContentSuperuser(this.state.content.id, token)
    }

    render() {
        return(
            <div className="superuser-userdetail">
                <div className="btn-group">
                    <button onClick={() => this.removeContent()} className="btn btn-red">Remove content</button>
                    <button onClick={() => this.closeDetails()} className="btn btn-green">Close Details</button>
                </div>
            </div>
        )
    }
}

export default ContentDetail
