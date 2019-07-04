
import React, {PropTypes}  from 'react';
import {TileLayer} from 'react-leaflet';
import grayscale from './leaflet.grayscale';
import L from 'leaflet';

/**
 * This component makes the background WMS grayscale
 */
export default class GrayTile extends TileLayer {

  componentWillMount() {
    super.componentWillMount();
    const { map: _map, layerContainer: _lc, ...props } = this.props;
    const ua = navigator.userAgent;
    const isIE = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    if (!isIE)
    {
      this.leafletElement = L.grayscale(props);
    } 
  }
}
