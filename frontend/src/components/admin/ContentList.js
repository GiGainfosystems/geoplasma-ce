import React, { Component } from 'react'
import ContentDetailContainer from "../../containers/ContentDetailContainer";

/**
* This component displays a list of all content and gives the superuser
* the possibility to remove content from the website (landingpage)
*/
class ContentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
          /** The content that is active (active content can be deleted)
             Content gets active when the user clicks on a listed item */
          activeContent: 0
        }
    }

    /**
    * Set the active content to the one that is clicked
    *@param {integer} content - the id of the content
    */
    clickContent(content) {
        this.setState({activeContent: content})
    }

    /**
    * Set the active content to 0 to not have any content marked as active
    * This function also gets called from the child component <ContentDetail>
    */
    unClickContent() {
        this.setState({activeContent: 0})
    }

    render() {
        return(
            <div>
                <table cellSpacing="0" className="superuser-table">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Title</td>
                            <td>User ID</td>
                        </tr>
                    </thead>

                    {this.props.contents.map((content, index) =>
                    <tbody key={content.id}>
                        <tr className={(index % 2 === 0 ? 'even' : 'odd')} onClick={() => this.clickContent(content.id)}>
                            <td>{content.id}</td>
                            <td>{content.title}</td>
                            <td>{content.user_id}</td>
                        </tr>
                        {content.id === this.state.activeContent &&
                        <tr>
                            <td colSpan="6">
                            <ContentDetailContainer content={content} removeContentSuperuser={this.props.removeContentSuperuser} unclickContent={() => this.unClickContent()} />
                            </td>
                        </tr>
                        }
                        </tbody>
                    )}
                </table>
            </div>
        )
    }
}

export default ContentList
