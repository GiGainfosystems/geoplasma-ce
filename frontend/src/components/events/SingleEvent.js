import React, { Component } from 'react'
import Header from '../header/Header'
import Subheader from '../subheader/Subheader'
import FilterBox from '../filterbox/FilterBox'
import getTranslation from '../../i18n/'
import { Link } from 'react-router-dom'
import Footer from '../footer/Footer'
import EventBox from './EventBox'

/**
 * Page for a single event
 */
class SingleEvent extends Component {

  render() {
      
      let event = this.props.event

    return(
      <div>
        {this.state.overlay &&<div className="fullpage-overlay"></div>}
        <Header />
        <div className="container container-small">
          <Subheader title="subheader.events" />

          {((this.props.notfound) && (!this.props.fetching.dataFetching.isFetching)) &&
              <h2>Not found</h2>
          }

          {((this.props.fetching.dataFetching.isFetching) && (this.props.notfound)) &&
              <div className="default-element default-element-dark profile-teaser">
                <div className="loader"></div>
              </div>
          }

          {!this.props.notfound &&
                <EventBox event={this.props.event} />
            }
            <Footer pages={this.props.pages} />
        </div>
      </div>
    )
  }
}

export default SingleEvent
