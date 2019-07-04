import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import { Link } from 'react-router-dom'
import FilterBox from '../filterbox/FilterBox'
import getTranslation from '../../i18n/'
import Footer from '../footer/Footer'
import KnowledgeBox from './KnowledgeBox'
import { buildFilterbox } from '../filterbox/filterhelper'

/**
 * The knowledge repository page which lists the contents of it and gives filter options
 */
class KnowledgeRepository extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemsPerPage: 10
        }
    }

    /**
     * Toggle the filters to filter the list of contents
     * @param  {} filter
     * @param  {} id
     */
    toggleFilter(filter, id) {
        let temp = this.props.filter.filters;
        let removed = false;
        temp[filter].filter.map((singleton, index) => {
            if(singleton === id) {
                temp[filter].filter.splice(index, 1);
                removed = true;
            }
        })
        if(temp[filter].single) {
            temp[filter].filter = [];
        }
        if(!removed) {
            if(id !== 0) {
                temp[filter].filter.push(id);
            }
        }
        this.props.updateFilter(temp)
    }

    /**
     * Filter the list of contents based on the tags
     * @param  {} tags
     */
    keywordFilter(tags) {
        this.props.tagSearch(tags);
    }


  render() {
      let currentPage = this.props.page ? this.props.page : 0;

      let pages = [];
      let contents = this.props.contents;

      if(currentPage*this.state.itemsPerPage > contents.length) {
          currentPage = 0;
      }

        if(contents.length > 0) {
            contents.map(content => {
                content.desc = content.synopsis.split('\n').map((item, key) => {
                    return <span key={key}>{item}<br/></span>
                })
            })
            let paged = [];
            for(let i = 0; i < this.state.itemsPerPage; i++) {
                let indexToPush = (currentPage*this.state.itemsPerPage) + i;
                if(contents[indexToPush] !== undefined) {
                    paged.push(contents[indexToPush])
                }

            }
            contents = paged;


            let numberOfPages = this.props.contents.length / this.state.itemsPerPage;
            numberOfPages = Math.ceil(numberOfPages);

            for(let i = 1; i<=numberOfPages;i++) {
                pages.push(i);
            }
        }


    let filters = buildFilterbox(this.props.filter.filters, this.props)

    return(

      <div>
        <Header />
        <div className="container container-small">
          <Subheader title="subheader.knowledge_repository" />

          <FilterBox keywordFilter={(tags) => this.keywordFilter(tags)} tags={this.props.tags} toggleFilter={(filter,id) => this.toggleFilter(filter, id)} title={getTranslation("filterbox.title")} filters={filters} filteroptions={this.props.filter.filters} />

          {((this.props.contents.length === 0) && (!this.props.fetching.dataFetching.isFetching)) &&
              <h2 className="no-result" dangerouslySetInnerHTML={{__html: getTranslation("contentview.no_content_existing")}}></h2>
          }

          {((this.props.contents.length !== 0) && (!this.props.fetching.dataFetching.isFetching)) &&
              <div className="pagination-box">
                <h2 className="no-result">{this.props.contents.length} {getTranslation("results.found")}</h2>
                <div className="pagination">
                    <ul>
                    <li>{getTranslation("pages")}:</li>
                    {(currentPage !== 0) &&
                        <li><Link to={"/experts/knowledge-repository/page/"+(currentPage)}>&lt;</Link></li>
                    }
                    {pages.map(page =>
                        <li className={(page === currentPage+1 ? 'active' : 'not-active')}><Link to={"/experts/knowledge-repository/page/"+(page)}>{page}</Link></li>
                    )}
                    {(currentPage !== pages.length-1) &&
                        <li><Link to={"/experts/knowledge-repository/page/"+(currentPage+2)}>&gt;</Link></li>
                    }
                    </ul>
                </div>
              </div>
          }

          {((this.props.fetching.dataFetching.isFetching) && (this.props.contents.length === 0)) &&
              <div className="default-element default-element-dark profile-teaser">
                <div className="loader"></div>
              </div>
          }

          {contents.map(content =>
              <KnowledgeBox key={content.id} content={content} languages={this.props.languages} />
          )}
          <Footer activeLanguage={this.props.language.locale} pages={this.props.pages} />
        </div>
      </div>
    )
  }
}

export default KnowledgeRepository
