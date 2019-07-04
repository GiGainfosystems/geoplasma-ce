import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import FilterBox from '../filterbox/FilterBox'
import Footer from '../footer/Footer'
import Overlay from '../overlay/Overlay'
import ContactForm from '../overlay/ContactForm'
import { Link } from 'react-router-dom'
import getTranslation from '../../i18n/'
import { filterCategories, buildFilterbox } from '../filterbox/filterhelper'
import ProfileBox from './ProfileBox'

/**
 * Yellow pages main page with a list of profiles and filter options
 */
class YellowPages extends Component {

  constructor(props) {
    super(props);
    this.state = {
        contactname: '',
        contactemail: '',
        overlay: false,
        itemsPerPage: 10
    }
  }
  
  /**
   * Contact form overlay
   * @param  {} name
   * @param  {} email
   */
  toggleOverlay(name, email) {
    this.setState({contactname: name, contactemail: email, overlay: !this.state.overlay})
  }

  /**
   * Toggle the filters
   * @param  {} filter
   * @param  {} id
   */
  toggleFilter(filter, id) {

      let temp = this.props.filter;
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
      this.props.updateYellowPagesFilter(temp)
  }


  render() {
      let currentPage = this.props.page ? this.props.page : 0;
      let pages = [];
      let profiles = this.props.userprofiles
      if(currentPage*this.state.itemsPerPage > profiles.length) {
          currentPage = 0;
      }
      if(profiles.length > 0) {
          profiles.map(profile => {
              profile.desc = profile.profile.split('\n').map((item, key) => {
                  return <span key={key}>{item}<br/></span>
              })
          })
          let paged = [];
          for(let i = 0; i < this.state.itemsPerPage; i++) {
              let indexToPush = (currentPage*this.state.itemsPerPage) + i;
              if(profiles[indexToPush] !== undefined) {
                  paged.push(profiles[indexToPush])
              }

          }
          profiles = paged;


          let numberOfPages = this.props.userprofiles.length / this.state.itemsPerPage;
          numberOfPages = Math.ceil(numberOfPages);

          for(let i = 1; i<=numberOfPages;i++) {
              pages.push(i);
          }
      }

    let filters = buildFilterbox(this.props.filter, this.props)

    return(
      <div>
        {this.state.overlay &&<Overlay><ContactForm fetching={this.props.fetching} sendMessage={this.props.sendMessage} toggleOverlay={() => this.toggleOverlay()} contactname={this.state.contactname} contactemail={this.state.contactemail} /></Overlay>}
        <Header />
        <div className="container container-small">
          <Subheader title="subheader.yellow_pages" />

          <FilterBox toggleFilter={(filter,id) => this.toggleFilter(filter, id)} title={getTranslation("filterbox.title")} filters={filters} filteroptions={this.props.filter} />

          {((profiles.length === 0) && (!this.props.fetching.dataFetching.isFetching)) &&
              <h2 className="no-result" dangerouslySetInnerHTML={{__html: getTranslation("userprofile.no_profile_existing")}}></h2>
          }

          {((this.props.userprofiles.length !== 0) && (!this.props.fetching.dataFetching.isFetching)) &&
              <div className="pagination-box">
                <h2 className="no-result">{this.props.userprofiles.length} {getTranslation("results.found")}</h2>
                <div className="pagination">
                <ul>
                <li>{getTranslation("pages")}:</li>
                {(currentPage !== 0) &&
                    <li><Link to={"/experts/yellow-pages/page/"+(currentPage)}>&lt;</Link></li>
                }
                {pages.map(page =>
                    <li className={(page === currentPage+1 ? 'active' : 'not-active')}><Link to={"/experts/yellow-pages/page/"+(page)}>{page}</Link></li>
                )}
                {(currentPage !== pages.length-1) &&
                    <li><Link to={"/experts/yellow-pages/page/"+(currentPage+2)}>&gt;</Link></li>
                }
                </ul>
                </div>
              </div>
          }

          {((this.props.fetching.dataFetching.isFetching) && (this.props.userprofiles.length === 0)) &&
              <div className="default-element default-element-dark profile-teaser">
                <div className="loader"></div>
              </div>
          }

              {profiles.map((profile, index) =>
                  <ProfileBox toggleOverlay={(name, email) => this.toggleOverlay(name, email)} key={profile.id} profile={profile} />
              )}
              <Footer activeLanguage={this.props.language.locale} pages={this.props.pages} />
        </div>
      </div>
    )
  }
}

export default YellowPages
