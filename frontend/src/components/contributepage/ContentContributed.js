import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import getTranslation from '../../i18n/'

/**
 * Component that lists the content that was submitted by the logged in user
 */
class ContentContributed extends Component {

  render() {
      
      let content = this.props.content.filter(item => item.user_id === this.props.user.id);
    return(
      <div className="contribute-section">
        <h4><i className="fa fa-book" aria-hidden="true"></i> {getTranslation("contentview.title")}: <Link to="/experts/contribute/content"><button className="btn btn-icon btn-green btn-new">{getTranslation("contentview.add_content_button")}</button></Link></h4>
        {content.length === 0 &&
          <p>{getTranslation("contentview.no_content_added")}</p>
        }
        {content.length !== 0 &&
        <div className="default-element-gray-content">
          <table cellSpacing="0">
            <thead>
              <tr>
                <th className="table-50">{getTranslation("contentview.table.title")}</th>
                <th className="table-25">{getTranslation("contentview.table.author")}</th>
                <th className="table-25">{getTranslation("contentview.table.year")}</th>
              </tr>
            </thead>
            <tbody>
          {content.length > 0 &&
            content.map((item, index) =>
              <tr className={(index % 2 === 0 ? 'white' : 'table-gray')} key={item.id}>
                <td><Link to={"/experts/contribute/content/"+item.id}>{item.title}</Link></td>
                <td>{item.author}</td>
                <td>{item.year}</td>
              </tr>
            )
          }
          </tbody>
          </table>
        </div>
      }
      </div>
    )
  }
}

export default ContentContributed
