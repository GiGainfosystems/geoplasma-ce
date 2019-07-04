import React, { Component } from 'react'
import { Marker } from 'react-leaflet'

class ExtendedMarker extends Marker {
	// "Hijack" the component lifecycle.
  componentDidMount() {
  	// Call the Marker class componentDidMount (to make sure everything behaves as normal)
  	super.componentDidMount();

    // Access the marker element and open the popup.
    this.leafletElement.openPopup();
  }

  componentDidUpdate(prevProps, prevState) {
      super.componentDidUpdate(prevProps, prevState); this.leafletElement.openPopup();
  } 
}

export default ExtendedMarker
