import React, { Component } from 'react'
import BigTile from './BigTile'

/**
 * Box around the tiles on the homepage of the knowledge platform
 */
class BigTileThird extends Component {

  render() {

    return(
      <div className="tiles-horizontal">
      {this.props.categories.map((category) =>
        <div key={category.icon} className="third">
        <BigTile title={category.title} icon={category.icon} description={category.description} linktitle={category.linktitle} link={category.link} />
        </div>
      )}
      </div>
    )
  }

}

export default BigTileThird
